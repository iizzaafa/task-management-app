from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy.orm import joinedload

from . import db
from .models import Task, User

tasks_bp = Blueprint("tasks", __name__)

VALID_STATUS = {"pending", "in_progress", "completed"}


def _is_admin():
    """Check if current user has admin role (from JWT claims)."""
    return (get_jwt() or {}).get("role") == "admin"


def _current_user_id():
    """Get current user ID from JWT identity (convert string back to int)."""
    return int(get_jwt_identity())


def _parse_int(value):
    """Safely parse value to int, return None on failure."""
    try:
        return int(value)
    except (ValueError, TypeError):
        return None


def _normalize(value):
    """Trim whitespace from string, return empty string if None."""
    return (value or "").strip()


def _normalize_status(value):
    """Normalize status: trim + lowercase."""
    return _normalize(value).lower()


def _task_response(task: Task):
    """Serialize task to JSON response format."""
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "user_id": task.user_id,
        "user_email": task.user.email if task.user else None,
        "created_at": task.created_at.isoformat() if task.created_at else None,
    }


def _base_task_query():
    """Base query — admin sees all, user sees own only."""
    query = Task.query.options(joinedload(Task.user))

    if not _is_admin():
        query = query.filter_by(user_id=_current_user_id())

    return query


def _get_user_or_none(user_id: int):
    """Get user by ID, return None if not found."""
    return db.session.get(User, user_id)


def _error(message, code=400):
    """Consistent error response format — uses 'error' key to match auth.py."""
    return jsonify({"error": message}), code


@tasks_bp.route("", methods=["GET"])
@jwt_required()
def get_tasks():
    tasks = (
        _base_task_query()
        .order_by(Task.created_at.desc())
        .all()
    )
    return jsonify([_task_response(t) for t in tasks]), 200


@tasks_bp.route("", methods=["POST"])
@jwt_required()
def create_task():
    data = request.get_json() or {}

    title = _normalize(data.get("title"))
    if not title:
        return _error("Title is required")

    status = _normalize_status(data.get("status") or "pending")
    if status not in VALID_STATUS:
        return _error("Invalid status. Must be: pending, in_progress, or completed")

    user_id = _current_user_id()

    if _is_admin() and data.get("user_id") is not None:
        parsed_id = _parse_int(data.get("user_id"))
        if parsed_id is None:
            return _error("Invalid user_id")

        user = _get_user_or_none(parsed_id)
        if not user:
            return _error("User not found", 404)

        user_id = user.id

    task = Task(
        title=title,
        description=_normalize(data.get("description")),
        status=status,
        user_id=user_id,
    )
    db.session.add(task)
    db.session.commit()

    return jsonify(_task_response(task)), 201


@tasks_bp.route("/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    task = db.session.get(Task, task_id)

    if not task:
        return _error("Task not found", 404)

    if not _is_admin() and task.user_id != _current_user_id():
        return _error("Forbidden", 403)

    data = request.get_json() or {}

    if "title" in data:
        title = _normalize(data.get("title"))
        if not title:
            return _error("Title cannot be empty")
        task.title = title

    if "description" in data:
        task.description = _normalize(data.get("description"))

    if "status" in data:
        status = _normalize_status(data.get("status"))
        if status not in VALID_STATUS:
            return _error("Invalid status. Must be: pending, in_progress, or completed")
        task.status = status

    if _is_admin() and "user_id" in data:
        parsed_id = _parse_int(data.get("user_id"))
        if parsed_id is None:
            return _error("Invalid user_id")

        user = _get_user_or_none(parsed_id)
        if not user:
            return _error("User not found", 404)

        task.user_id = user.id

    db.session.commit()
    return jsonify(_task_response(task)), 200


@tasks_bp.route("/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    task = db.session.get(Task, task_id)

    if not task:
        return _error("Task not found", 404)

    if not _is_admin() and task.user_id != _current_user_id():
        return _error("Forbidden", 403)

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted successfully"}), 200
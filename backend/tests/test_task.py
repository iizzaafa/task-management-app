def test_create_task(client, user_token):
    """Test authenticated user can create a task."""
    res = client.post(
        "/tasks",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"title": "My task", "description": "Test description"}
    )
    assert res.status_code == 201
    assert res.json["title"] == "My task"


def test_get_tasks_requires_auth(client):
    """SECURITY: Getting tasks without auth returns 401."""
    res = client.get("/tasks")
    assert res.status_code == 401


def test_user_sees_only_own_tasks(client, user_token, admin_token):
    """SECURITY: Regular user only sees their own tasks, not others."""
    # Admin creates a task (assigned to admin by default)
    client.post(
        "/tasks",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"title": "Admin's task"}
    )
    # User creates their own task
    client.post(
        "/tasks",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"title": "User's task"}
    )
    # User should only see their own task
    res = client.get(
        "/tasks",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 200
    titles = [t["title"] for t in res.json]
    assert "User's task" in titles
    assert "Admin's task" not in titles


def test_admin_sees_all_tasks(client, user_token, admin_token):
    """Test admin can see tasks from all users."""
    # User creates a task
    client.post(
        "/tasks",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"title": "User task"}
    )
    # Admin creates a task
    client.post(
        "/tasks",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"title": "Admin task"}
    )
    # Admin should see BOTH tasks
    res = client.get(
        "/tasks",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    titles = [t["title"] for t in res.json]
    assert "User task" in titles
    assert "Admin task" in titles


def test_user_cannot_delete_others_task(client, user_token, admin_token):
    """SECURITY: Regular user cannot delete another user's task."""
    # Admin creates a task
    res = client.post(
        "/tasks",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"title": "Admin's task"}
    )
    task_id = res.json["id"]

    # Regular user tries to delete admin's task
    res = client.delete(
        f"/tasks/{task_id}",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 403
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()


def seed_admin(app):
    """Seed the first admin user from environment variables."""
    from app.models import User

    with app.app_context():
        admin_email = os.getenv("ADMIN_EMAIL", "admin@admin.com").strip().lower()
        admin_password = os.getenv("ADMIN_PASSWORD", "Admin@123")

        existing = User.query.filter_by(email=admin_email).first()
        if existing:
            print(f"ℹ️  Admin already exists: {admin_email}")
            return

        hashed_pw = bcrypt.generate_password_hash(admin_password).decode("utf-8")
        admin = User(email=admin_email, password_hash=hashed_pw, role="admin")
        db.session.add(admin)
        db.session.commit()
        print(f"✅ Admin seeded successfully: {admin_email}")


def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from app.auth import auth_bp
    from app.tasks import tasks_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(tasks_bp, url_prefix="/tasks")

    with app.app_context():
        db.create_all()
        seed_admin(app)

    return app
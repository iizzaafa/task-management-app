import pytest
import os

os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-key"
os.environ["SECRET_KEY"] = "test-secret"
os.environ["ADMIN_EMAIL"] = "admin@admin.com"
os.environ["ADMIN_PASSWORD"] = "Admin@123"

from app import create_app


@pytest.fixture
def app():
    """Create test Flask app with in-memory SQLite database."""
    app = create_app()
    app.config["TESTING"] = True
    yield app


@pytest.fixture
def client(app):
    """Create test client for making HTTP requests."""
    return app.test_client()


@pytest.fixture
def admin_token(client):
    """Login as default admin and return JWT token."""
    res = client.post("/auth/login", json={
        "email": "admin@admin.com",
        "password": "Admin@123"
    })
    return res.json["access_token"]


@pytest.fixture
def user_token(client):
    """Register a regular user and return their JWT token."""
    client.post("/auth/register", json={
        "email": "user@test.com",
        "password": "User@1234"
    })
    res = client.post("/auth/login", json={
        "email": "user@test.com",
        "password": "User@1234"
    })
    return res.json["access_token"]
def test_register_success(client):
    """Test successful user registration."""
    res = client.post("/auth/register", json={
        "email": "newuser@test.com",
        "password": "User@1234"
    })
    assert res.status_code == 201
    assert res.json["user"]["role"] == "user"


def test_register_duplicate_email(client):
    """Test registration with duplicate email fails."""
    client.post("/auth/register", json={
        "email": "duplicate@test.com",
        "password": "User@1234"
    })
    res = client.post("/auth/register", json={
        "email": "duplicate@test.com",
        "password": "User@1234"
    })
    assert res.status_code == 409


def test_register_missing_fields(client):
    """Test registration with missing fields fails."""
    res = client.post("/auth/register", json={"email": "test@test.com"})
    assert res.status_code == 400


def test_public_register_cannot_create_admin(client):
    """SECURITY: Public registration must ignore role field."""
    res = client.post("/auth/register", json={
        "email": "hacker@test.com",
        "password": "Hack@1234",
        "role": "admin"
    })
    assert res.status_code == 201
    # Even though attacker requested admin, backend forces "user"
    assert res.json["user"]["role"] == "user"


def test_login_success(client):
    """Test successful login returns JWT token."""
    client.post("/auth/register", json={
        "email": "login@test.com",
        "password": "Login@1234"
    })
    res = client.post("/auth/login", json={
        "email": "login@test.com",
        "password": "Login@1234"
    })
    assert res.status_code == 200
    assert "access_token" in res.json


def test_login_wrong_password(client):
    """Test login with wrong password returns 401."""
    client.post("/auth/register", json={
        "email": "wrongpw@test.com",
        "password": "Correct@1234"
    })
    res = client.post("/auth/login", json={
        "email": "wrongpw@test.com",
        "password": "Wrong@1234"
    })
    assert res.status_code == 401


def test_admin_can_list_users(client, admin_token):
    """Test admin can access the users list endpoint."""
    res = client.get(
        "/auth/admin/users",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    assert isinstance(res.json, list)


def test_user_cannot_list_users(client, user_token):
    """SECURITY: Regular user cannot access admin endpoints."""
    res = client.get(
        "/auth/admin/users",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 403
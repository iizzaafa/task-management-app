# TaskFlow - Task Management Application

A secure, full-stack task management application with role-based access control, built with Flask, React.js, MySQL, and Docker.

---

## Quick Start (For Reviewers)

```bash
# Clone and run (takes ~1 minute)
git clone https://github.com/iizzaafa/task-management-app.git
cd task-management-app
docker-compose up --build
```

Open http://localhost:3000

**Admin login:** `admin@admin.com` / `Admin@123`

Scroll down for detailed setup, security approach, and testing procedures.

---

## Features

### Authentication & Security
- JWT-based authentication with role claims
- Bcrypt password hashing
- Password strength validation (8+ chars, uppercase, lowercase, number, special char)
- Show/hide password toggle
- Email format validation
- Auto-logout on token expiry
- Protected routes on frontend and backend
- Privilege escalation prevention (public registration always creates regular users)

### User Roles

**Regular User**
- Self-register via public registration page
- View and manage only their own tasks
- Create, edit, delete own tasks

**Administrator**
- Seeded automatically on first startup via environment variables
- View and manage ALL tasks from ALL users
- Assign tasks to specific users
- Reassign tasks to different users
- Create new users (with role selection: user or admin)
- Delete users (cascade deletes their tasks)
- Cannot delete own account (prevents lockout)

### Task Management
- Create tasks with title, description, and status
- Three status states: Pending, In Progress, Completed
- Inline status updates from task list
- Admin can assign/reassign tasks to any user

---

## Tech Stack

- **Frontend**: React.js, React Router, Axios, Lucide React icons
- **Backend**: Flask, Flask-JWT-Extended, Flask-Bcrypt, SQLAlchemy
- **Database**: MySQL 8.0
- **Infrastructure**: Docker, Docker Compose, Nginx
- **Testing**: pytest, pytest-flask

---

## Project Structure

```
task-manager/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── models.py
│   │   └── tasks.py
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   └── test_tasks.py
│   ├── config.py
│   ├── run.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── InputField.jsx
│   │   │   ├── PasswordStrength.jsx
│   │   │   ├── SideBar.jsx
│   │   │   └── SplitLayout.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── UserManagement.jsx
│   │   ├── utils/
│   │   │   ├── auth.js
│   │   │   ├── format.js
│   │   │   └── validation.js
│   │   └── App.jsx
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) v20+ (only if running locally without Docker)
- [Python](https://www.python.org/) v3.11+ (only if running locally without Docker)

---

## Setup with Docker (Recommended)

### Step 1 - Navigate to project

```bash
cd task-manager
```

### Step 2 - Ensure Docker Desktop is running

Open Docker Desktop and wait until you see "Engine Running" at the bottom left.

### Step 3 - Start all services

```bash
docker-compose up --build
```

This automatically starts:
- MySQL database on port **3306**
- Flask backend on port **5001**
- React frontend on port **3000**

The default admin account is automatically seeded on first startup.

### Step 4 - Open the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

### Step 5 - Stop all services

```bash
docker-compose down
```

To reset the database (removes all users and tasks):

```bash
docker-compose down -v
```

---

## Default Admin Credentials

The first admin account is seeded automatically from environment variables in `docker-compose.yml`:

| Field | Value |
|-------|-------|
| Email | `admin@admin.com` |
| Password | `Admin@123` |

**Important:** Change these in `docker-compose.yml` before deploying to production. The admin is only seeded if no admin with that email exists in the database.

---

## How to Register

### Regular User (Public Registration)

1. Go to http://localhost:3000/register
2. Enter email and password (must meet strength requirements)
3. Confirm password
4. Click **REGISTER**
5. Auto-redirect to login page
6. Account created with "user" role

### Admin Access

Admin accounts **cannot** be self-registered through the public page. There are only two ways to get admin access:

**Option 1: Default Admin (Auto-Seeded)**
- Use credentials from `docker-compose.yml`: `admin@admin.com` / `Admin@123`

**Option 2: Created by Existing Admin**
1. Login as an admin
2. Click **Users** in the sidebar
3. Fill the "Create New User" form
4. Select role: **Regular User** or **Administrator**
5. Click **Create User**

---

## Password Requirements

All passwords must contain:
- At least 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*)

---

## API Endpoints

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new regular user (role hardcoded to "user") |
| POST | `/auth/login` | Login and receive JWT token |

### Admin User Management (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/admin/users` | List all users |
| POST | `/auth/admin/users` | Create user with specified role |
| DELETE | `/auth/admin/users/<id>` | Delete user (cascades to tasks) |

### Tasks (Authenticated)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/tasks` | Get tasks | User sees own; Admin sees all |
| POST | `/tasks` | Create task | User creates own; Admin can assign to any user |
| PUT | `/tasks/<id>` | Update task | Owner or Admin only |
| DELETE | `/tasks/<id>` | Delete task | Owner or Admin only |

---

## Security Approach

This application follows security best practices to prevent common attacks:

### Privilege Escalation Prevention
- `POST /auth/register` is hardcoded to create `role="user"` regardless of request body
- The `role` field in public registration requests is deliberately ignored
- Only admins can create other admins, via the protected `/auth/admin/users` endpoint

### Authentication & Authorization
- JWT tokens include role claims for efficient authorization
- Admin endpoints verify role against the database (not just JWT claims) as defense-in-depth
- JWT identity stored as string (Flask-JWT-Extended v4+ compliant)
- Sessions cleared on token expiry with auto-redirect to login

### Data Isolation
- Regular users can only access their own tasks (enforced at query level)
- Admins have full CRUD access to all tasks
- Task ownership verified on every update/delete operation
- Admins cannot delete their own account (prevents system lockout)

### Frontend Defense
- Route guards for protected routes (`ProtectedRoute`, `AdminRoute`, `PublicRoute`)
- Axios interceptor auto-attaches JWT tokens
- Axios interceptor handles 401 responses with session cleanup
- Frontend role checks are for UX only; backend is the source of truth
- Passwords are cleared from React state after submission

---

## Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| email | VARCHAR(120) | Unique user email |
| password_hash | VARCHAR(255) | Bcrypt hashed password |
| role | VARCHAR(20) | "user" or "admin" |

### Tasks Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| title | VARCHAR(200) | Task title (required) |
| description | TEXT | Task description |
| status | VARCHAR(50) | "pending", "in_progress", or "completed" |
| user_id | INT | Foreign key to users.id (ON DELETE CASCADE) |
| created_at | DATETIME | Auto-set on creation |

Tasks are automatically deleted when the owning user is deleted (cascade).

---

## Setup Without Docker (Alternative)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create `.env` file in `backend/` folder:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/taskdb
SECRET_KEY=change-me-in-prod
JWT_SECRET_KEY=jwt-secret-change-in-prod
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=Admin@123
```

Run the backend:

```bash
python run.py
```

Backend runs on http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000

---

## Running Tests

### Backend Tests (Automated)

The backend has **13 automated tests** covering authentication, authorization, and data isolation. Tests use an in-memory SQLite database for speed (no external services required).

```bash
# Run inside Docker container
docker exec -it task-backend pytest tests/ -v

# Or run locally (without Docker)
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

### Expected Test Output

```
tests/test_auth.py::test_register_success PASSED
tests/test_auth.py::test_register_duplicate_email PASSED
tests/test_auth.py::test_register_missing_fields PASSED
tests/test_auth.py::test_public_register_cannot_create_admin PASSED
tests/test_auth.py::test_login_success PASSED
tests/test_auth.py::test_login_wrong_password PASSED
tests/test_auth.py::test_admin_can_list_users PASSED
tests/test_auth.py::test_user_cannot_list_users PASSED
tests/test_tasks.py::test_create_task PASSED
tests/test_tasks.py::test_get_tasks_requires_auth PASSED
tests/test_tasks.py::test_user_sees_only_own_tasks PASSED
tests/test_tasks.py::test_admin_sees_all_tasks PASSED
tests/test_tasks.py::test_user_cannot_delete_others_task PASSED

13 passed in 10.08s
```

### Test Coverage

| Category | Count | What It Tests |
|----------|-------|---------------|
| **Authentication** | 6 | Registration, login, password validation, duplicate detection |
| **Authorization** | 2 | Admin-only endpoints reject regular users (403) |
| **Data Isolation** | 3 | Users only see/modify their own tasks |
| **Security** | 2 | Privilege escalation prevention, unauthorized access (401) |

### Key Security Tests

- **`test_public_register_cannot_create_admin`**: Verifies that even when a malicious request includes `"role": "admin"`, the backend forces the role to `"user"` — preventing privilege escalation.
- **`test_user_sees_only_own_tasks`**: Confirms that regular users cannot see tasks belonging to other users, even if they query the endpoint directly.
- **`test_user_cannot_delete_others_task`**: Confirms that attempting to delete another user's task returns 403 Forbidden.

### Manual Testing

In addition to automated tests, follow these procedures to verify full end-to-end flows:

#### Admin Flow

1. Login with `admin@admin.com` / `Admin@123`
2. Sidebar displays "Admin" badge (teal) and "Users" link
3. Click **Users** → view all users, create new users (user or admin role)
4. Click **Tasks** → create task with "Assign to" dropdown to select owner
5. View all tasks from all users on dashboard

#### Regular User Flow

1. Register via `/register` with new email
2. Login → sidebar displays "User" badge (grey)
3. "Users" link is NOT visible
4. Direct URL `/admin/users` redirects to dashboard
5. Tasks page has no "Assign to" dropdown (tasks auto-assigned to self)

### Manual Security Tests

**Test 1: Privilege Escalation via curl**

```bash
curl -X POST http://localhost:5001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"hacker@test.com","password":"Hack@1234","role":"admin"}'
```

Expected: User created, but role in database is `"user"` (not `"admin"`).

**Test 2: Unauthorized Admin Access**

```bash
# Login as regular user, copy access_token
curl -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"regular@user.com","password":"User@1234"}'

# Try admin endpoint
curl -X GET http://localhost:5001/auth/admin/users \
  -H "Authorization: Bearer <user_token>"
```

Expected: 403 Forbidden with `{"error": "Admin access required"}`.

**Test 3: Frontend SessionStorage Tampering**

1. Login as regular user
2. Open DevTools → Application → Session Storage
3. Change `role` value to `admin`
4. Refresh page

Expected: Sidebar UI may show "Users" link, but API calls still return 403. Backend verifies role against database, not sessionStorage.

### Frontend Tests (Future Work)

Frontend automated testing with Jest and React Testing Library is planned for future iteration.

---

## Docker Services

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| frontend | task-frontend | 3000 | React app served by Nginx |
| backend | task-backend | 5001 | Flask REST API |
| db | task-db | 3306 | MySQL 8.0 database |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | `mysql+pymysql://root:password@db:3306/taskdb` | MySQL connection string |
| SECRET_KEY | `change-me-in-prod` | Flask secret key |
| JWT_SECRET_KEY | `jwt-secret-change-in-prod` | JWT signing key |
| ADMIN_EMAIL | `admin@admin.com` | Default admin email (seeded on startup) |
| ADMIN_PASSWORD | `Admin@123` | Default admin password (seeded on startup) |

All variables are set in `docker-compose.yml` under the `backend` service's `environment` section.

---

## Troubleshooting

### Docker not starting

Ensure Docker Desktop is running and "Engine Running" is displayed.

```bash
docker-compose down
docker-compose up --build
```

### Port already in use

Change port mapping in `docker-compose.yml`:

```yaml
ports:
  - "5002:5000"  # Change host port from 5001 to 5002
```

Update `frontend/src/api/axios.js` baseURL accordingly.

### Database connection error

MySQL takes 15-30 seconds to initialize on first start. If backend fails:

```bash
docker-compose restart backend
```

### Admin password changed but login fails

The admin is only seeded once on first startup. To re-seed with new credentials:

```bash
docker-compose down -v
docker-compose up --build
```

Warning: This deletes all data in the database.

### JWT error: "Subject must be a string"

This occurs if you have an old JWT token from a previous version. Clear your session:

1. Open DevTools (F12) → Application → Session Storage
2. Clear all
3. Login again

### Tests fail with "No module named 'app'"

Make sure you're running pytest from the `backend/` directory, not inside `tests/`:

```bash
cd backend
pytest tests/ -v
```

---

## Future Improvements

- **Cloud deployment** (AWS, Azure, or GCP) with managed MySQL
- **HTTP-only cookies** for JWT storage (replace sessionStorage for XSS protection)
- **Refresh tokens** for longer sessions without compromising security
- **Password reset flow** via email
- **Two-factor authentication** for admin accounts
- **Audit logging** for admin actions (create/delete users, reassign tasks)
- **Rate limiting** on authentication endpoints
- **Frontend automated tests** (Jest + React Testing Library)
- **Production WSGI server** optimizations (increase Gunicorn workers)
- **CI/CD pipeline** with GitHub Actions for automated testing on PR

---

## License

This project is built as part of a technical assessment.

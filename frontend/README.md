# Task Management Application

A full-stack Task Management Application built with Flask, React.js, MySQL, and Docker.

---

## Tech Stack

- **Frontend**: React.js, Lucide React
- **Backend**: Flask, Flask-JWT-Extended, Flask-Bcrypt
- **Database**: MySQL 8.0
- **Infrastructure**: Docker, Docker Compose

---

## Project Structure
task-manager/
├── backend/
│   ├── app/
│   │   ├── init.py
│   │   ├── auth.py
│   │   ├── models.py
│   │   └── tasks.py
│   ├── config.py
│   ├── run.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── InputField.jsx
│   │   │   ├── PasswordStrength.jsx
│   │   │   ├── SideBar.jsx
│   │   │   ├── SplitLayout.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Task.jsx
│   │   └── utils/
│   │       ├── auth.js
│   │       └── validation.js
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── README.md

---

## Prerequisites

Make sure you have these installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (v20+)
- [Python](https://www.python.org/) (v3.11+)

---

## Setup and Run with Docker (Recommended)

### Step 1 - Clone or download the project

```bash
cd Desktop
cd task-manager
```

### Step 2 - Make sure Docker Desktop is running

Open Docker Desktop and wait until you see Engine Running at the bottom left.

### Step 3 - Start all services

```bash
docker-compose up --build
```

This automatically starts:
- MySQL database on port 3306
- Flask backend on port 5001
- React frontend on port 3000

### Step 4 - Open the application
Frontend  → http://localhost:3000
Backend   → http://localhost:5001

### Step 5 - Stop all services

```bash
docker-compose down
```

---

## Setup Without Docker

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

Create a `.env` file inside the backend folder:
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/taskdb
SECRET_KEY=change-me-in-prod
JWT_SECRET_KEY=jwt-secret-in-prod

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

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login and get JWT | No |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /tasks | Get tasks | Yes |
| POST | /tasks | Create new task | Yes |
| PUT | /tasks/<id> | Update task | Yes |
| DELETE | /tasks/<id> | Delete task | Yes |

---

## How Authentication Works
User registers → password hashed with bcrypt → saved to MySQL
User logs in → Flask returns JWT token
React stores JWT in sessionStorage
Every API request sends JWT in Authorization header
Flask verifies JWT on every protected endpoint
Token expired or missing → redirect to login automatically

---

## User Roles

### Regular User
- Register without admin code
- See only their own tasks
- Create, edit, delete own tasks only

### Admin
- Register using secret admin code
- See ALL tasks from ALL users
- Edit and delete ANY task
- See which user owns each task

---

## How to Register

### As Regular User:
1. Go to http://localhost:3000/register
2. Fill in email and password
3. Leave admin code empty
4. Click CONFIRM

### As Admin:
1. Go to http://localhost:3000/register
2. Fill in email and password
3. Enter admin code: `ADMIN123`
4. Click CONFIRM

---

## Password Rules

All passwords must contain:
- At least 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*)

---

## Database Structure

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto increment |
| email | VARCHAR(120) | Unique user email |
| password_hash | VARCHAR(255) | Bcrypt hashed password |
| role | VARCHAR(20) | user or admin |

### Tasks Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto increment |
| title | VARCHAR(200) | Task title |
| description | TEXT | Task description |
| status | VARCHAR(50) | pending, in_progress, completed |
| user_id | INT | Foreign key to users table |
| created_at | DATETIME | Auto set on creation |

---

## Running Tests

### Backend Tests

```bash
cd backend

# Install test dependencies
pip install pytest pytest-flask

# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_auth.py -v
pytest tests/test_tasks.py -v
```

### Expected test output
tests/test_auth.py::test_register_success PASSED
tests/test_auth.py::test_register_duplicate_email PASSED
tests/test_auth.py::test_register_missing_fields PASSED
tests/test_auth.py::test_login_success PASSED
tests/test_auth.py::test_login_wrong_password PASSED
tests/test_auth.py::test_login_wrong_email PASSED
tests/test_auth.py::test_register_as_admin PASSED
tests/test_tasks.py::test_create_task PASSED
tests/test_tasks.py::test_get_tasks PASSED
tests/test_tasks.py::test_update_task PASSED
tests/test_tasks.py::test_delete_task PASSED
tests/test_tasks.py::test_unauthorized_access PASSED
### Frontend Tests

```bash
cd frontend
npm test
```

---

## Docker Services

| Service | Port | Description |
|---------|------|-------------|
| frontend | 3000 | React app served by nginx |
| backend | 5001 | Flask REST API |
| db | 3306 | MySQL 8.0 database |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | mysql+pymysql://root:password@db:3306/taskdb | MySQL connection string |
| SECRET_KEY | change-me | Flask secret key |
| JWT_SECRET_KEY | jwt-secret | JWT token signing key |

---

## Troubleshooting

### Docker not starting?

```bash
# Make sure Docker Desktop is open and Engine Running
# Then run:
docker-compose down
docker-compose up --build
```

### Port 5000 already in use?

Change the port in docker-compose.yml:
```yaml
ports:
  - "5001:5000"
```

And update axios.js baseURL:
```javascript
baseURL: "http://localhost:5001"
```

### Database connection error?

```bash
# MySQL takes time to start
# Wait 30 seconds then restart backend:
docker-compose restart backend
```

### WSL needs updating?

```bash
wsl --update
```

Then reopen Docker Desktop and click Try Again.

---

## Features Summary

- JWT Authentication with role-based access
- Password hashing with bcrypt
- Password strength validation
- Show/hide password toggle
- Admin secret code registration
- Admin dashboard shows all users tasks
- Regular user sees only own tasks
- Task status: Pending, In Progress, Completed
- Unauthorized requests redirect to login
- Dockerized with one command startup
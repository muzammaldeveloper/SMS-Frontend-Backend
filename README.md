# sms-backend-frontend

Student Management System — a full‑stack web application for managing students, teachers, admins, and attendance with a modern dashboard UI.

**Type:** Full‑stack web application  
**Frontend:** Next.js (App Router) + React  
**Backend:** Python Flask (modular routers/schemas/models)

---

## Overview
- Manage students, teachers, admins, and attendance across an admin dashboard.
- Frontend built with Next.js App Router, Tailwind CSS, and Radix UI.
- Backend served from [BackEnd/app.py](BackEnd/app.py), creating the app via `src.create_app()`.
- Clean separation of concerns with models, routers, and schemas in [BackEnd/src](BackEnd/src).

## Features
- Authentication (login/signup) for admin users.
- CRUD for students, teachers, and admins.
- Attendance tracking and reporting.
- Responsive dashboard with reusable UI components.
- Form validation and error handling.
- Environment‑based config (development vs. production).

## Tech Stack
### Frontend (Next.js 14 / React 19)
- Framework: Next.js (App Router)
- UI Library: React
- Styling: Tailwind CSS
- UI Components: Radix UI primitives
- Forms: React Hook Form + Zod validation
- State: React Context / Zustand (optional)
- HTTP: Axios or Fetch API

### Backend (Python Flask)
- Framework: Flask
- ORM: SQLAlchemy
- Validation: Pydantic‑style schemas
- Database: SQLite (development), PostgreSQL (production)
- Auth: JWT or session‑based
- API: RESTful endpoints

## Project Structure
- Frontend app routes: [FrontEnd/app](FrontEnd/app) including auth and admin sections.
- UI components: [FrontEnd/components/ui](FrontEnd/components/ui) reusable building blocks.
- Frontend config: [FrontEnd/package.json](FrontEnd/package.json), [FrontEnd/next.config.mjs](FrontEnd/next.config.mjs), [FrontEnd/tsconfig.json](FrontEnd/tsconfig.json).
- Backend entry: [BackEnd/app.py](BackEnd/app.py).
- Backend modules: [BackEnd/src/models](BackEnd/src/models), [BackEnd/src/routers](BackEnd/src/routers), [BackEnd/src/schemas](BackEnd/src/schemas).
- Static assets: [FrontEnd/public](FrontEnd/public).

## Getting Started
### Prerequisites
- Node.js 18+ and pnpm or npm
- Python 3.10+

### Frontend Setup
```powershell
cd "C:\Users\Dark Wolf 🐺\Desktop\sms_task1\FrontEnd"
# Prefer pnpm
pnpm install
pnpm dev
# Or with npm
npm install
npm run dev
```
App runs on http://localhost:3000.

### Backend Setup
```powershell
cd "C:\Users\Dark Wolf 🐺\Desktop\sms_task1\BackEnd"
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirments.txt
python app.py
```
API runs on http://localhost:5000.

## Environment Variables
### Frontend
Create [FrontEnd/.env](FrontEnd/.env) with values such as:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Student Management System
```

### Backend
Create [BackEnd/.env](BackEnd/.env) with values such as:
```
FLASK_ENV=development
SECRET_KEY=super-secret-key
DATABASE_URL=sqlite:///sms.db
JWT_SECRET=another-secret
CORS_ORIGINS=http://localhost:3000
```

## API Overview
Routers live in [BackEnd/src/routers](BackEnd/src/routers):
- Auth: [BackEnd/src/routers/auth_router.py](BackEnd/src/routers/auth_router.py)
	- `POST /api/auth/login` — login
	- `POST /api/auth/signup` — register admin
	- `POST /api/auth/logout` — logout
- Students: [BackEnd/src/routers/students_router.py](BackEnd/src/routers/students_router.py)
	- `GET /api/students` — list students
	- `POST /api/students` — create student
	- `GET /api/students/{id}` — get student
	- `PUT /api/students/{id}` — update student
	- `DELETE /api/students/{id}` — delete student
- Teachers: [BackEnd/src/routers/teachers_router.py](BackEnd/src/routers/teachers_router.py)
	- `GET /api/teachers` — list teachers
	- `POST /api/teachers` — create teacher
	- `GET /api/teachers/{id}` — get teacher
	- `PUT /api/teachers/{id}` — update teacher
	- `DELETE /api/teachers/{id}` — delete teacher
- Admins: [BackEnd/src/routers/admin_router.py](BackEnd/src/routers/admin_router.py)
	- `GET /api/admins` — list admins
	- `POST /api/admins` — create admin
- Attendance: [BackEnd/src/routers/attendance_router.py](BackEnd/src/routers/attendance_router.py)
	- `GET /api/attendance` — list records
	- `POST /api/attendance` — mark attendance
	- `GET /api/attendance/{id}` — get record

Schemas are under [BackEnd/src/schemas](BackEnd/src/schemas) and models under [BackEnd/src/models](BackEnd/src/models).

## Database
- Development: SQLite (`sqlite:///sms.db`)
- Production: PostgreSQL (`postgresql://user:pass@host:port/dbname`)
- Migrations: recommended via Alembic (not included by default)

## Scripts
### Frontend
- `dev` — run local dev server
- `build` — production build
- `start` — start a built app

### Backend
- `app.py` — runs Flask server via [BackEnd/app.py](BackEnd/app.py)

## Git & Deployment
### First Commit & Remote
```powershell
cd "C:\Users\Dark Wolf 🐺\Desktop\sms_task1"
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git add .
git commit -m "Initial commit: project setup"
```

### Create GitHub Repo and Push (CLI)
```powershell
gh auth login
gh repo create sms-backend-frontend --source=. --remote=origin --private --push
```

### Manual Remote
```powershell
git remote add origin https://github.com/<user>/sms-backend-frontend.git
git push -u origin main
```

## Contributing
- Fork the repo and create a feature branch.
- Run lint/tests locally before opening a PR.
- Keep PRs focused and well‑described.

## Troubleshooting
- Windows CRLF/LF warnings can be solved by adding `.gitattributes` and/or `git config core.autocrlf true`.
- Ensure environment files exist: [FrontEnd/.env](FrontEnd/.env) and [BackEnd/.env](BackEnd/.env).
- Verify ports are available (Frontend 3000, Backend 5000).

## License
TBD

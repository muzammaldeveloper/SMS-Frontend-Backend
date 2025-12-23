# Student Management System

A full‑stack web application for managing students, teachers, admins, and attendance through a modern, responsive dashboard.

**Type:** Full‑stack monorepo  
**Frontend:** Next.js (App Router) + React + Tailwind + Radix UI  
**Backend:** Flask + SQLAlchemy (modular routers/schemas/models)

---

## Overview
- Admin dashboard for CRUD over students, teachers, admins
- Attendance tracking and reporting
- Clear separation: Next.js FrontEnd and Flask BackEnd
- Maintainable structure (models, routers, schemas)

## Tech Stack
### Frontend (Next.js 14 / React 18+)
- Routing: App Router
- Styling: Tailwind CSS
- Forms/Validation: React Hook Form + Zod

### Backend (Python Flask)
- ORM: SQLAlchemy
- Auth: JWT/session friendly
- DB: SQLite (dev), PostgreSQL (prod)

## Monorepo Layout
- Frontend app routes: FrontEnd/app (auth, admin, students, teachers, attendance)
- UI components: FrontEnd/components/ui
- Backend entry: BackEnd/app.py (creates app via src.create_app)
- Backend modules: BackEnd/src/{models,routers,schemas}

## Getting Started
### Prerequisites
- Node.js 18+
- Python 3.10+

### Frontend
```powershell
cd "C:\Users\Dark Wolf 🐺\Desktop\Student Management System\FrontEnd"
# Prefer pnpm
pnpm install
pnpm dev
# Or with npm
npm install
npm run dev
# App: http://localhost:3000
```

### Backend
```powershell
cd "C:\Users\Dark Wolf 🐺\Desktop\Student Management System\BackEnd"
python -m venv .venv
.venv\Scripts\Activate.ps1
# Intentionally not tracking requirements file in VCS
# If needed locally, install packages manually or from your own file
pip install -r requirments.txt
python app.py
# API: http://localhost:5000
```

## Environment Variables
### Frontend (FrontEnd/.env)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Student Management System
```

### Backend (BackEnd/.env)
```
FLASK_ENV=development
SECRET_KEY=super-secret-key
DATABASE_URL=sqlite:///sms.db
JWT_SECRET=another-secret
CORS_ORIGINS=http://localhost:3000
```

## API Overview
- Auth: POST /api/auth/login, POST /api/auth/signup, POST /api/auth/logout
- Students: GET/POST /api/students, GET/PUT/DELETE /api/students/{id}
- Teachers: GET/POST /api/teachers, GET/PUT/DELETE /api/teachers/{id}
- Admins: GET/POST /api/admins
- Attendance: GET/POST /api/attendance, GET /api/attendance/{id}

## Git
This repo ignores venvs, node_modules, build artifacts, env files, and BackEnd/requirments.txt by design. See .gitignore.

### First Push (already configured here)
```powershell
cd "C:\Users\Dark Wolf 🐺\Desktop\Student Management System"
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/muzammaldeveloper/Student-Management-System.git
git push -u origin main
```

### Ongoing
```powershell
git add .
git commit -m "Update"
git push
```

## Troubleshooting
- Windows line endings: this repo includes .gitattributes for CRLF/LF handling
- Ensure .env files exist in FrontEnd and BackEnd
- Verify ports 3000 (frontend) and 5000 (backend) are free

## License
TBD

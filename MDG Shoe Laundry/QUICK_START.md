# ⚡ Quick Start - TL;DR Version

## 5-Minute Overview

```bash
# 1. INSTALL (one-time only)
# - Git: https://git-scm.com/download/win
# - Node.js LTS: https://nodejs.org/
# - PostgreSQL: https://www.postgresql.org/download/windows/

# 2. CLONE & UPDATE
git clone https://github.com/aline-001/MDG-COMPANY-LTD.git
cd "MDG Shoe Laundry"
git pull

# 3. BACKEND SETUP
cd mdg-shoe-laundry-backend

# Create .env file with:
# DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/mdg_shoe_laundry"
# JWT_SECRET=your-secret-key

# Create database:
# psql -U postgres
# CREATE DATABASE mdg_shoe_laundry;
# \q

npm install
npx prisma migrate deploy
npm run start:dev  # Terminal 1 - KEEP RUNNING

# 4. FRONTEND SETUP (New Terminal)
cd ../mdg-shoe-laundry-frontend
npm install
npm run dev  # Terminal 2 - KEEP RUNNING

# 5. DONE! 
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

---

## Install Checklist

| Tool | Command to Verify | Status |
|------|-------------------|--------|
| Git | `git --version` | ☐ |
| Node.js | `node --version` | ☐ |
| npm | `npm --version` | ☐ |
| PostgreSQL | `psql --version` | ☐ |

---

## Environment Variables (.env)

**Location:** `mdg-shoe-laundry-backend/.env`

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/mdg_shoe_laundry
JWT_SECRET=any-random-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
TWILIO_ACCOUNT_SID=optional
```

---

## Two Terminals Needed

### Terminal 1 - Backend
```bash
cd mdg-shoe-laundry-backend
npm run start:dev
```
**Output:** `Server running on http://localhost:3000`

### Terminal 2 - Frontend
```bash
cd mdg-shoe-laundry-frontend
npm run dev
```
**Output:** `Local: http://localhost:5173/`

---

## Common Commands

```bash
# Backend
npm run start:dev          # Dev mode with reload
npm run build              # Production build
npm run test               # Run tests
npx prisma studio         # Visual database editor

# Frontend  
npm run dev                # Development
npm run build              # Production build
npm run lint               # Check code

# Git
git pull                   # Get latest
git add .                  # Stage changes
git commit -m "message"    # Commit
git push                   # Push to remote
```

---

## Troubleshooting Quick Fixes

```bash
# Port already in use?
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# npm issues?
rm node_modules -r
npm install

# Database issues?
npx prisma migrate reset

# PostgreSQL not running?
net start postgresql-x64-16
```

---

## Default Credentials (After Seed)

```
Email: admin@mdg.com
Password: admin123
```

---

**Full guide:** See `COMPLETE_SETUP_GUIDE.md` for detailed instructions

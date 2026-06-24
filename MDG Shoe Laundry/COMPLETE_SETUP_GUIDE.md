# 🚀 Complete Setup Guide - MDG Shoe Laundry Project

> **For someone starting from ZERO** - This guide covers everything needed to get the project running on Windows

---

## 📋 Prerequisites Checklist

Before you start, you'll need to install:
- [ ] Git
- [ ] Node.js (with npm)
- [ ] PostgreSQL
- [ ] Git clone the project
- [ ] VS Code (optional, recommended)

---

## Phase 1: Install Git

### Step 1.1: Download Git
1. Go to https://git-scm.com/download/win
2. Download the Windows installer (usually the latest version)
3. Run the installer and follow the default settings
4. Click "Next" through all screens and finish the installation

### Step 1.2: Verify Git Installation
```bash
git --version
```
You should see a version number like `git version 2.x.x`

---

## Phase 2: Install Node.js (This includes npm)

### Step 2.1: Download Node.js
1. Go to https://nodejs.org/
2. Click the **LTS (Long Term Support)** button
3. Download the Windows installer (.msi file)
4. Run the installer

### Step 2.2: Follow Installation Wizard
- Click "Next" until you reach "Tools for Native Modules"
- Check the box: ✅ **Automatically install the necessary tools. Make this page by running `npm install -windows-build-tools`...**
- Click "Next" and "Install"
- Wait for installation to complete (may take a few minutes)

### Step 2.3: Verify Node.js and npm Installation
```bash
node --version
npm --version
```
You should see version numbers for both

---

## Phase 3: Install PostgreSQL Database

### Step 3.1: Download PostgreSQL
1. Go to https://www.postgresql.org/download/windows/
2. Click on the latest version (usually 16 or higher)
3. Download the installer (.exe file)

### Step 3.2: Run PostgreSQL Installer
1. Run the installer
2. When asked for a password, **remember this password** - you'll need it later
   - Example: `postgres123` (write it down!)
3. Port should be **5432** (default)
4. Locale: Leave as default
5. Click "Next" through remaining steps and finish

### Step 3.3: Verify PostgreSQL Installation
Open PowerShell and run:
```bash
psql --version
```
You should see a version number

---

## Phase 4: Clone the Project and Update to Latest Changes

### Step 4.1: Open PowerShell or Command Prompt
Press `Win + R`, type `powershell`, and press Enter

### Step 4.2: Navigate to Your Desired Location
```bash
# Go to Desktop or Documents (choose one)
cd Desktop

# Or if using OneDrive
cd C:\Users\YourUsername\OneDrive\Desktop
```

### Step 4.3: Clone the Repository
```bash
git clone https://github.com/aline-001/MDG-COMPANY-LTD.git
```

### Step 4.4: Enter the Project Folder
```bash
cd MDG-COMPANY-LTD
cd "MDG Shoe Laundry"
```

### Step 4.5: Get the Latest Changes
```bash
git pull
```

---

## Phase 5: Backend Setup (NestJS + PostgreSQL)

### Step 5.1: Enter Backend Directory
```bash
cd mdg-shoe-laundry-backend
```

### Step 5.2: Install Dependencies
```bash
npm install
```
*This may take 2-5 minutes. Wait for it to complete.*

### Step 5.3: Create Environment Configuration File
Create a file named `.env` in the `mdg-shoe-laundry-backend` folder:

```plaintext
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/mdg_shoe_laundry"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# SMS Configuration (Optional - Twilio)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

**Note:** Replace `postgres123` with the password you created for PostgreSQL

### Step 5.4: Create PostgreSQL Database
```bash
# Connect to PostgreSQL
psql -U postgres -h localhost

# In the PostgreSQL prompt, run:
CREATE DATABASE mdg_shoe_laundry;
```

Then exit:
```bash
\q
```

### Step 5.5: Setup Prisma Database Schema
```bash
# Apply database migrations
npx prisma migrate deploy

# Seed database with initial data (optional)
npm run prisma:seed
```

### Step 5.6: Start the Backend Server
```bash
# Development mode with auto-reload
npm run start:dev
```

✅ **Backend is running!** You should see:
```
[Nest] 1234  - 05/26/2026, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 1234  - 05/26/2026, 10:30:00 AM     LOG [InstanceLoader] .... 
[Nest] 1234  - 05/26/2026, 10:30:01 AM     LOG [RoutesResolver] ... ✓ Backend Server
[Nest] 1234  - 05/26/2026, 10:30:01 AM     LOG Server running on http://localhost:3000
```

**Leave this terminal running!**

---

## Phase 6: Frontend Setup (React + Vite)

### Step 6.1: Open a NEW PowerShell/Terminal Window
Press `Ctrl + Shift + ~ ` in VS Code (or open a new PowerShell window)

### Step 6.2: Navigate to Frontend Directory
```bash
# From the project root:
cd mdg-shoe-laundry-frontend
```

### Step 6.3: Install Frontend Dependencies
```bash
npm install
```
*This may take 2-3 minutes.*

### Step 6.4: Start Frontend Development Server
```bash
npm run dev
```

✅ **Frontend is running!** You should see:
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## Phase 7: Access the Application

### 🎉 You're Done! Now Access the App:

1. **Frontend**: Open browser to http://localhost:5173
2. **Backend API**: http://localhost:3000
3. **API Documentation**: http://localhost:3000/api/docs (Swagger UI)

---

## 🔐 Default Login Credentials

When the database is seeded, you should have:

```
Admin Account:
Email: admin@mdg.com
Password: admin123

Test Customer Account:
Email: customer@example.com
Password: customer123
```

*(Adjust these based on your seed data)*

---

## Troubleshooting

### ❌ "git is not recognized"
- Git is not installed or not in PATH
- **Solution**: Reinstall Git, making sure to select "Add Git to PATH"

### ❌ "node is not recognized"
- Node.js not installed or not in PATH
- **Solution**: Reinstall Node.js and restart PowerShell

### ❌ "psql is not recognized"
- PostgreSQL not installed properly
- **Solution**: Reinstall PostgreSQL, ensure "Add PostgreSQL to PATH" is checked

### ❌ "Database connection failed"
- PostgreSQL not running or wrong password
- **Solution**: 
  ```bash
  # Windows: Start PostgreSQL service
  net start postgresql-x64-16
  ```
- Verify DATABASE_URL in `.env` matches your setup

### ❌ "Port 3000 already in use"
- Another application is using port 3000
- **Solution**: Kill the process or use different port:
  ```bash
  # PowerShell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
  ```

### ❌ "Port 5173 already in use"
- Another application is using port 5173
- **Solution**: Kill the process or the dev server will auto-assign next port

### ❌ "npm install fails"
- Corrupted node_modules
- **Solution**:
  ```bash
  rm -r node_modules
  rm package-lock.json
  npm install
  ```

### ❌ "Prisma migration fails"
- Database schema issues
- **Solution**:
  ```bash
  # Reset and reseed
  npx prisma migrate reset
  npm run prisma:seed
  ```

---

## 📝 Daily Development Workflow

After initial setup, each day when you start working:

### Terminal 1 - Backend:
```bash
cd mdg-shoe-laundry-backend
npm run start:dev
```

### Terminal 2 - Frontend:
```bash
cd mdg-shoe-laundry-frontend
npm run dev
```

### Terminal 3 - General Git commands (optional):
```bash
# Get latest changes
git pull

# Make changes and commit
git add .
git commit -m "Your message"
git push
```

---

## ✨ Optional: VS Code Extensions

For better development experience, install these extensions:

1. **Prisma** - by Prisma
2. **Thunder Client** or **REST Client** - for API testing
3. **ES7+ React/Redux/React-Native snippets** - by dsznajder
4. **PostgreSQL** - by Chris Kolkman
5. **GitLens** - by GitKraken

---

## 🎯 Verification Checklist

After following all steps, verify:

- [ ] Git installed: `git --version`
- [ ] Node installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] PostgreSQL installed: `psql --version`
- [ ] Project cloned: Folder exists
- [ ] Backend runs on port 3000
- [ ] Frontend runs on port 5173
- [ ] Can login to application
- [ ] Can create orders (if customer)

---

## 📞 Need Help?

If something doesn't work:
1. Check the troubleshooting section above
2. Read the error message carefully
3. Search Google for the error
4. Check the project's GitHub issues
5. Ask the team lead

---

## 🚀 You're Ready!

The project should now be fully functional on your laptop. Happy coding! 🎉

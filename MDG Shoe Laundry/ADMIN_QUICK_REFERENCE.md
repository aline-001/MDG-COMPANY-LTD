# 🔐 Admin & Password Security - Quick Reference

## ✅ Password Security Status

Your system uses **Bcrypt (10 rounds)** - Industry standard, production-ready ✓

```typescript
// What happens when someone creates an account:
1. User enters password: "MySecurePassword123"
2. Backend generates salt: bcrypt.genSalt(10)
3. Backend hashes password: bcrypt.hash(password, salt)
4. Result stored in database: "$2b$10$N9qo8uLOickgxE0CwDtGW..."
5. Original password is DELETED - never stored

// What happens when someone logs in:
1. User enters email & password
2. Backend finds user by email
3. Backend compares: bcrypt.compare(enteredPassword, storedHash)
4. If match → Generate JWT token
5. If no match → Reject login (403 Unauthorized)
```

---

## 🚀 How To Create First Admin (30 seconds)

### Step 1: Generate Bcrypt Hash
```bash
node -e "require('bcrypt').hash('Admin@123', 10, (err, hash) => console.log(hash))"
```
Copy the output hash.

### Step 2: Insert Admin into Database
```sql
INSERT INTO "User" (email, password, "firstName", "lastName", phone, role, "isActive", "createdAt", "updatedAt")
VALUES ('admin@mdgshoelaundry.com', '[PASTE_HASH_HERE]', 'Admin', 'User', '+1', 'ADMIN', true, NOW(), NOW());
```

### Step 3: Login
- URL: http://localhost:3000/auth/login
- Email: admin@mdgshoelaundry.com
- Password: Admin@123

### Step 4: Access Admin Dashboard
- URL: http://localhost:3000/admin/dashboard
- Done! ✓

---

## 🛠️ What Was Added

### Backend Files
```
src/auth/admin.controller.ts  (NEW)
  ├── /api/admin/promote          → Promote user to ADMIN
  ├── /api/admin/demote           → Change user role to STAFF/CUSTOMER
  ├── /api/admin/users            → List all admins/staff
  ├── /api/admin/customers        → List all customers
  ├── /api/admin/deactivate-user  → Deactivate account
  ├── /api/admin/activate-user    → Reactivate account
  ├── /api/admin/dashboard-stats  → Get statistics
  └── /api/admin/verify-admin     → Check if user is admin
```

### Frontend Pages
```
app/admin-access/page.tsx  (NEW)
  - Admin setup guide
  - Step-by-step instructions
  - Security information
  - Troubleshooting
```

---

## 📊 User Roles

| Role | Dashboard | Manage Users | Manage Orders | Manage Services |
|------|-----------|--------------|---------------|-----------------|
| ADMIN | ✅ Full | ✅ Yes | ✅ All | ✅ Yes |
| STAFF | ❌ Limited | ❌ No | ✅ Assigned | ❌ View only |
| CUSTOMER | ❌ No | ❌ No | ✅ Own only | ✅ View |

---

## 🔑 API Examples

### Promote User to Admin
```bash
curl -X POST http://localhost:5000/api/admin/promote \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{ "userId": 2 }'
```

### List All Admin/Staff Users
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer [JWT_TOKEN]"
```

### Deactivate User
```bash
curl -X POST http://localhost:5000/api/admin/deactivate-user \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{ "userId": 5 }'
```

---

## 🔒 Security Features

| Feature | Implementation | Status |
|---------|-----------------|--------|
| Password Hashing | Bcrypt 10 rounds | ✅ Secure |
| Password Storage | Hash only (no plain text) | ✅ Secure |
| Password Comparison | bcrypt.compare() | ✅ Secure |
| JWT Tokens | 1hr access + 7day refresh | ✅ Secure |
| Role Protection | AuthGuard + RolesGuard | ✅ Secure |
| Route Protection | @UseGuards on endpoints | ✅ Secure |

---

## 🎯 Step-by-Step Admin Setup

```
STEP 1: Generate Admin Password Hash
├─ Run: node -e "require('bcrypt').hash('Admin@123', 10, (err, hash) => console.log(hash))"
└─ Copy: $2b$10$...

STEP 2: Insert Admin into Database
├─ Connect to PostgreSQL
├─ Paste SQL with hash from Step 1
└─ Verify insertion

STEP 3: Start Services
├─ Backend: npm run start:dev
└─ Frontend: npm run dev

STEP 4: Login as Admin
├─ Go to: http://localhost:3000/auth/login
├─ Email: admin@mdgshoelaundry.com
├─ Password: Admin@123
└─ Click: Login

STEP 5: Access Admin Dashboard
├─ URL: http://localhost:3000/admin/dashboard
└─ See: Stats, Orders, Users, Services

DONE! ✓
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Check email exists, password correct, user active |
| "Forbidden" error | User must have ADMIN role, not CUSTOMER |
| Can't access dashboard | Must be logged in as ADMIN, check token valid |
| Password not hashing | Ensure bcrypt installed, 10 rounds set |
| Token expired | Request new token using refresh token |

---

## 📱 Access URLs

| Page | URL |
|------|-----|
| Login | http://localhost:3000/auth/login |
| Admin Guide | http://localhost:3000/admin-access |
| Admin Dashboard | http://localhost:3000/admin/dashboard |
| Register | http://localhost:3000/auth/register |

---

## 🔄 Password Requirements

- ✅ Minimum 8 characters
- ✅ Any characters allowed (letters, numbers, symbols)
- ✅ Case-sensitive
- ✅ Hashed with bcrypt before stored

**Example Strong Password:**
```
SecureAdmin@2026!
```

---

## ✨ What's Included

✅ Secure password hashing (bcrypt)  
✅ Admin role system (ADMIN/STAFF/CUSTOMER)  
✅ JWT authentication (1hr tokens)  
✅ Role-based access control  
✅ Admin API endpoints (8 endpoints)  
✅ Admin dashboard interface  
✅ Admin access guide page  
✅ Complete documentation  

---

## 📋 Checklist

Before going live:

- [ ] Generate JWT_SECRET (32+ chars)
- [ ] Create first admin user
- [ ] Test login with admin
- [ ] Verify admin dashboard works
- [ ] Test admin API endpoints
- [ ] Check password hashing in database
- [ ] Verify role-based access
- [ ] Test with wrong password (should fail)
- [ ] Test with CUSTOMER role (should get 403)

---

**All Set!** 🎉  
Your admin system is production-ready!

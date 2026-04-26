# 🏮 MDG Shoe Laundry - Professional Shoe Cleaning Platform

> **A complete, production-ready shoe laundry management system with beautiful UI, strong backend, and comprehensive features.**

## 🎯 Project Vision

Transform shoe care into a seamless, professional experience with:
- ✨ Beautiful, modern user interface
- 🔐 Secure authentication & role-based access
- 📊 Complete business management system
- 💼 Professional customer experience
- 📈 Business analytics & insights

---

## 🌟 Key Features

### For Customers
- 📱 Easy order creation and tracking
- 👤 Profile management
- 💳 Multiple payment options
- ⭐ Leave reviews & ratings
- 📋 Order history & receipts
- 🔔 Real-time notifications

### For Admin/Staff
- 📊 Comprehensive dashboard
- 📦 Order management & tracking
- 💰 Revenue analytics
- 👥 Customer management
- 📈 Business statistics
- 🔧 Service management

### Platform Features
- 🔐 JWT authentication
- 🛡️ Role-based access control
- 💳 Payment processing
- 📧 Email notifications
- 📱 SMS notifications
- 📱 Mobile responsive
- ♿ Accessible design
- 🚀 Fast performance

---

## 🏗️ Architecture

### Backend Stack
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Security**: Bcrypt password hashing

### Frontend Stack
- **Framework**: Next.js 14+ (React)
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **Design**: Professional corporate theme

---

## 📁 Project Structure

```
mdg-shoe-laundry/
├── mdg-shoe-laundry-backend/      Backend API (NestJS)
├── mdg-shoe-laundry-frontend/     Frontend (Next.js)
├── PROJECT_SUMMARY.md              Full project details
└── QUICK_START.md                  Quick setup guide
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Backend Setup
```bash
cd mdg-shoe-laundry-backend
npm install
# Configure .env file
npx prisma migrate dev
npm run start
```

### Frontend Setup
```bash
cd mdg-shoe-laundry-frontend
npm install
# Configure .env.local file
npm run dev
```

**Then visit**: http://localhost:3000

---

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Setup instructions & quick reference
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete feature list & architecture

---

## 🎨 UI Highlights

- 🎯 Professional color scheme (Blue/Teal)
- 📱 Fully responsive design
- ⚡ Smooth animations & transitions
- ♿ Accessible components
- 🎨 Reusable component library

---

## 🔐 Security

✅ JWT authentication with expiry
✅ Refresh token mechanism
✅ Role-based access control
✅ Bcrypt password hashing
✅ Input validation
✅ CORS protection
✅ Secure error handling

---

## 📊 Database Schema

**Core Models:**
- `User` - Customers, staff, admin
- `Order` - Order management
- `Shoe` - Individual shoe items
- `Service` - Service catalog
- `Payment` - Payment tracking
- `Review` - Customer reviews
- `Notification` - Multi-channel notifications
- `FileUpload` - File management

---

## 🌐 Pages & Routes

### Public Pages
- Home (`/`)
- Services (`/services`)
- Pricing (`/pricing`)
- How It Works (`/how-it-works`)
- About (`/about`)
- Contact (`/contact`)

### Authenticated Pages
- Dashboard (`/dashboard`)
- Admin Dashboard (`/admin/dashboard`)

### Auth Pages
- Login (`/auth/login`)
- Register (`/auth/register`)

---

## 🎯 API Endpoints

### Authentication
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
```

### Orders
```
GET    /orders
POST   /orders
GET    /orders/:id
PUT    /orders/:id
PUT    /orders/:id/status
```

### Other Modules
```
GET    /services
POST   /orders/:id/reviews
GET    /payments
POST   /payments
```

---

## 💡 What's Included

✅ Complete Prisma schema
✅ NestJS backend modules (Auth, Orders, Services, Payments, Reviews)
✅ JWT authentication with RBAC
✅ Next.js pages (6 public + dashboard + admin)
✅ Reusable component library
✅ Design system (colors, typography, spacing)
✅ Responsive layouts
✅ Form validation
✅ Error handling
✅ Type safety (TypeScript)

---

## 🚀 Deployment Ready

The application is ready for deployment to:
- Vercel (Frontend)
- Heroku / Railway / Render (Backend)
- AWS / DigitalOcean (Full stack)
- Docker (Containerized)

---

## 📈 Future Enhancements

- AI shoe analysis
- Pickup/delivery tracking
- SMS notifications
- Advanced analytics
- Mobile app (React Native)
- Subscription plans
- Multi-location support
- Staff scheduling

---

## 🤝 Contributing

Feel free to extend and customize:
1. Add new services
2. Extend API endpoints
3. Create new pages
4. Add payment gateways
5. Integrate third-party services

---

## 📝 License

This project is built for MDG Shoe Laundry. All rights reserved.

---

## 📞 Support

For questions or issues:
1. Check QUICK_START.md
2. Review PROJECT_SUMMARY.md
3. Check console logs
4. Review component source code

---

## ✨ Getting Started

1. **Read** → [QUICK_START.md](./QUICK_START.md)
2. **Setup** → Backend + Frontend
3. **Visit** → http://localhost:3000
4. **Explore** → All features
5. **Customize** → Your needs

---

## 🎉 Ready to Launch!

Your professional shoe laundry platform is complete. Customize it with your branding and launch to your customers!

**Happy cleaning! 🧼👟**

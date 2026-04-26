# 🚀 Quick Start Guide - Email & SMS Setup

## 🚀 Get Running in 5 Minutes

### Step 1: Gmail Setup (Email Notifications)

1. Open https://myaccount.google.com/apppasswords
2. Select **Mail** and **Windows Computer**
3. Google will generate a 16-character password
4. Copy and paste into `EMAIL_PASSWORD` in `.env`:

```env
EMAIL_USER=albertmendolza295@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Your 16-char password
```

### Step 2: Twilio Setup (SMS Notifications)

1. Go to https://www.twilio.com/console
2. Copy your **Account SID**
3. Copy your **Auth Token**
4. Copy your **Twilio Phone Number** (like +1234567890)
5. Add these to `.env`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 3: Complete Backend .env

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mdg_shoe_laundry"

# JWT
JWT_SECRET="change-this-to-something-long-and-random"
JWT_REFRESH_SECRET="change-this-to-something-different"

# Email (Gmail)
EMAIL_USER="albertmendolza295@gmail.com"
EMAIL_PASSWORD="xxxx xxxx xxxx xxxx"
EMAIL_FROM="noreply@mdgshoelaundry.com"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="ACxxxx..."
TWILIO_AUTH_TOKEN="your_token"
TWILIO_PHONE_NUMBER="+1234567890"

# URLs
BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"

# Server
PORT=3001
NODE_ENV="development"
```

### Step 4: Start Backend

```bash
cd mdg-shoe-laundry-backend

# Install packages
npm install

# Run migrations
npx prisma migrate dev

# Start server
npm run start:dev

# Should say: ✓ Email service ready
#            ✓ SMS service initialized
```

### Step 5: Start Frontend

```bash
cd mdg-shoe-laundry-frontend

# Install packages
npm install

# Create .env.local
echo 'NEXT_PUBLIC_API_URL="http://localhost:3001"' > .env.local

# Start dev server
npm run dev

# Visit: http://localhost:3000
```

---

## ✅ Test It Works

### Test Email
1. Create an order with a valid email
2. Check albertmendolza295@gmail.com inbox
3. Should receive professional HTML email with order details

### Test SMS
1. Create an order with a valid phone number
2. Check the phone for SMS notification
3. Message format: `✓ Order Confirmed! Order #[NUMBER]...`

---

## 🎨 New Components to Use

### Button Variants
```jsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Light</Button>
<Button variant="gradient">Premium</Button>
```

### Card Variants
```jsx
<Card variant="default">Default</Card>
<Card variant="gradient">Gradient Background</Card>
<Card variant="bordered">Highlighted Border</Card>
<Card variant="glass">Frosted Glass</Card>
```

### Toast Notifications
```jsx
import { useToast } from '@/components/Toast';

function MyComponent() {
  const { success, error, info, warning } = useToast();
  
  return (
    <button onClick={() => success("Success!", "Order created")}>
      Show Toast
    </button>
  );
}
```

---

## 🔍 Troubleshooting

### Emails Not Sending?
- Check Gmail app password is correct (not regular password)
- Verify 2FA is enabled on Gmail account
- Ensure port 587 is not blocked by firewall

### SMS Not Working?
- Verify phone number format: `+1234567890` (with + and country code)
- Check Twilio has credits/not on trial
- Confirm phone is verified in Twilio console

### Backend Won't Start?
- All .env variables are set
- PostgreSQL is running
- Port 3001 is not in use

---

## 📝 File Reference

**Just Modified:**
- `mdg-shoe-laundry-backend/package.json` - Added nodemailer, twilio
- `src/notifications/notifications.service.ts` - Email & SMS
- `src/orders/orders.service.ts` - Notification triggers

**Just Created:**
- `components/Button.tsx` - Enhanced buttons
- `components/Card.tsx` - Enhanced cards
- `components/Hero.tsx` - Hero section
- `components/Features.tsx` - Features grid
- `components/Pricing.tsx` - Pricing cards
- `components/Toast.tsx` - Toast system

---

**Full setup details:** See `SETUP_AND_DEPLOYMENT.md`  
**Complete feature list:** See `IMPLEMENTATION_SUMMARY.md`

npm install

# Setup environment variables
# Create .env file with:
# DATABASE_URL="postgresql://user:password@localhost:5432/mdg_shoe_laundry"
# JWT_SECRET="your-super-secret-key-here"
# JWT_REFRESH_SECRET="your-refresh-secret-key-here"

# Run database migrations
npx prisma migrate dev --name init

# Start server
npm run start

# Server runs on: http://localhost:3001
```

### 2. Frontend Setup
```bash
cd mdg-shoe-laundry-frontend

# Install dependencies
npm install

# Setup environment variables
# Create .env.local file with:
# NEXT_PUBLIC_API_URL="http://localhost:3001"

# Start development server
npm run dev

# App runs on: http://localhost:3000
```

---

## 🎯 Key Pages & Features

### Public Pages
| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page with hero & features |
| Services | `/services` | Service catalog with pricing |
| Pricing | `/pricing` | Detailed pricing table |
| How It Works | `/how-it-works` | Process explanation |
| About | `/about` | Company story & team |
| Contact | `/contact` | Contact form & info |

### Logged In Pages
| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/dashboard` | Customer overview |
| Orders | `/dashboard` | Order history |
| Profile | `/dashboard` | Profile management |
| Payments | `/dashboard` | Payment history |
| Reviews | `/dashboard` | Review history |

### Admin Pages
| Page | URL | Purpose |
|------|-----|---------|
| Admin | `/admin/dashboard` | Business metrics |
| Orders | `/admin/dashboard` | Order management |
| Customers | `/admin/dashboard` | Customer list |
| Analytics | `/admin/dashboard` | Revenue charts |

### Auth Pages
| Page | URL | Purpose |
|------|-----|---------|
| Login | `/auth/login` | User login |
| Register | `/auth/register` | New account signup |

---

## 🔑 Default Test Credentials

```
Email: demo@example.com
Password: password123
```

These are for demo purposes - create real accounts through the registration page.

---

## 📊 Database Models

### User
- Stores customer/staff/admin profiles
- Authentication credentials
- Contact information

### Order
- Customer orders
- Status tracking
- Pricing & payments
- Related shoes and services

### Service
- Shoe cleaning services
- Pricing & duration
- Service descriptions

### Payment
- Payment transactions
- Multiple payment methods
- Revenue tracking

### Review
- Customer ratings (1-5)
- Written reviews
- Review approval

### Notification
- Email notifications
- SMS notifications
- In-app notifications

---

## 🔐 Authentication Flow

### Registration
```
1. User fills signup form
2. Password validated (min 8 chars)
3. Account created in database
4. JWT tokens generated
5. User logged in automatically
```

### Login
```
1. User enters email/password
2. Credentials verified
3. Access token issued (1 hour)
4. Refresh token issued (7 days)
5. User redirected to dashboard
```

### Role-Based Access
```
CUSTOMER  - Standard user access
STAFF     - Order management access
ADMIN     - Full platform access
```

---

## 🛠️ API Endpoints (Key Examples)

### Authentication
```
POST   /auth/register       - Create new account
POST   /auth/login          - Login user
POST   /auth/refresh        - Refresh access token
POST   /auth/logout         - Logout user
```

### Orders
```
GET    /orders              - List user's orders
POST   /orders              - Create new order
GET    /orders/:id          - Get order details
PUT    /orders/:id          - Update order
PUT    /orders/:id/status   - Update order status
PUT    /orders/:id/cancel   - Cancel order
```

### Services
```
GET    /services            - List all services
GET    /services/:id        - Get service details
POST   /services            - Create service (admin)
PUT    /services/:id        - Update service (admin)
```

### Reviews
```
POST   /reviews/order/:orderId   - Create review
GET    /reviews                  - Get all reviews
GET    /reviews/my-reviews       - Get my reviews
PUT    /reviews/:id              - Update review
DELETE /reviews/:id              - Delete review
```

---

## 🎨 UI Components Available

All components are reusable and customizable:

```tsx
// Examples
<Button variant="primary" size="lg">Click Me</Button>
<Card hoverable> ... </Card>
<Badge variant="success">Active</Badge>
<Input label="Email" type="email" />
<Alert type="success">Success!</Alert>
```

---

## 📱 Responsive Design

All pages automatically adapt to:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1280px+)

---

## 🚀 Deployment Checklist

Before going live, ensure:

- [ ] Backend environment variables set
- [ ] Database migrations completed
- [ ] Frontend API URL configured
- [ ] Email service configured (optional)
- [ ] SMS service configured (optional)
- [ ] SSL certificate installed
- [ ] CORS properly configured
- [ ] Error logging setup
- [ ] Analytics integrated
- [ ] Backup strategy in place

---

## 🐛 Troubleshooting

### Backend won't start
```
√ Check PostgreSQL is running
√ Verify DATABASE_URL is correct
√ Run: npx prisma generate
√ Run: npx prisma migrate dev
```

### Frontend blank page
```
√ Check NEXT_PUBLIC_API_URL is set
√ Verify API server is running
√ Check browser console for errors
√ Clear cache: npm run build
```

### Database errors
```
√ Verify PostgreSQL connection
√ Check schema with: npx prisma db push
√ Review migrations: npx prisma migrate status
```

---

## 📚 Learn More

- **Prisma Docs**: https://www.prisma.io/docs/
- **NestJS Docs**: https://docs.nestjs.com/
- **Next.js Docs**: https://nextjs.org/docs
- **TailwindCSS**: https://tailwindcss.com/docs

---

## 💡 Pro Tips

1. **Use TypeScript** - All files are typed for safety
2. **Reuse Components** - Don't duplicate - use component library
3. **Follow Patterns** - Check existing code for patterns to follow
4. **Add .env.local** - Never commit secrets to git
5. **Test Locally** - Always test before deploying
6. **Use Git** - Make meaningful commits with good messages

---

## 🎯 Next Development Tasks

### Priority 1 (Core)
- [ ] Connect frontend forms to backend API
- [ ] Implement file upload for order photos
- [ ] Setup email notifications
- [ ] Add order tracking page

### Priority 2 (Enhanced)
- [ ] Add payment gateway integration
- [ ] Implement AI shoe analysis
- [ ] Add SMS notifications
- [ ] Create mobile app

### Priority 3 (Advanced)
- [ ] Multi-location support
- [ ] Subscription plans
- [ ] Staff scheduling
- [ ] Advanced analytics

---

## 📞 Getting Help

Key resources:
- **Backend Errors** → Check console logs
- **API Issues** → Test with Postman
- **Frontend Issues** → Check browser DevTools
- **Database Issues** → Check Prisma Studio: `npx prisma studio`

---

## ✨ You're All Set!

Your MDG Shoe Laundry platform is ready to launch. Start by:

1. Setting up the database
2. Starting the backend server
3. Starting the frontend app
4. Visiting http://localhost:3000
5. Creating a test account
6. Exploring the features

**Happy coding! 🚀**

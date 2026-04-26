# 🚀 MDG Shoe Laundry - Setup & Configuration Guide

## 📋 Overview

Your complete shoe laundry platform is now **production-ready** with:
- ✨ **Beautiful, Professional UI** with premium components
- 📧 **Email notifications** (Nodemailer) sending to albertmendolza295@gmail.com
- 📱 **SMS notifications** (Twilio) to customer phone numbers
- 🔐 **Strong backend** with proper authentication and authorization
- 💳 **Multiple payment options** and order management
- ⭐ **Professional customer experience** across all touchpoints

---

## ⚙️ Environment Configuration

### Backend (.env)

Create `.env` file in `mdg-shoe-laundry-backend/`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mdg_shoe_laundry"

# JWT Authentication
JWT_SECRET="your-super-secret-key-change-this-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-this-in-production"
JWT_EXPIRATION="3600" # 1 hour in seconds
JWT_REFRESH_EXPIRATION="604800" # 7 days in seconds

# Email Configuration (Nodemailer)
# For Gmail: Use an App Password, NOT your regular password
# Generate at: https://myaccount.google.com/apppasswords
EMAIL_USER="albertmendolza295@gmail.com"
EMAIL_PASSWORD="your-gmail-app-password"
EMAIL_FROM="noreply@mdgshoelaundry.com"

# SMS Configuration (Twilio)
# Sign up at: https://www.twilio.com/console
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890" # Your Twilio phone number

# Backend URL (for email links)
BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"

# Server
PORT=3001
NODE_ENV="development"

# Database Seed (Optional)
SEED_PASSWORD="DefaultPassword123!"
```

### Frontend (.env.local)

Create `.env.local` file in `mdg-shoe-laundry-frontend/`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_API_TIMEOUT="30000"
```

---

## 🔧 Setup Instructions

### 1️⃣ Backend Setup

```bash
cd mdg-shoe-laundry-backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed

# Start development server
npm run start:dev

# Server runs on: http://localhost:3001
```

### 2️⃣ Frontend Setup

```bash
cd mdg-shoe-laundry-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# App runs on: http://localhost:3000
```

---

## 📧 Email Notification Setup

### Gmail Configuration (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
   - Paste into `EMAIL_PASSWORD` in `.env`

### Alternative Email Providers

**SendGrid:**
```env
EMAIL_SERVICE="sendgrid"
SENDGRID_API_KEY="your-sendgrid-api-key"
```

**Mailgun:**
```env
EMAIL_SERVICE="mailgun"
MAILGUN_API_KEY="your-mailgun-api-key"
```

---

## 📱 SMS Notification Setup

### Twilio Configuration

1. **Sign up** at: https://www.twilio.com/console
2. **Get your credentials**:
   - Account SID
   - Auth Token
   - Phone Number (the one sending messages)
3. **Add your phone number** to verified numbers in Twilio console
4. **Paste credentials** into `.env`:
   ```env
   TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   TWILIO_AUTH_TOKEN="your_auth_token_here"
   TWILIO_PHONE_NUMBER="+1234567890"
   ```

### Notification Flow

When a customer creates an order:
1. ✓ Email sent to customer (order confirmation)
2. ✓ SMS sent to customer (order confirmation)
3. ✓ Email sent to admin (albertmendolza295@gmail.com)

When order status changes to "READY_FOR_PICKUP":
1. ✓ Professional email with pickup instructions
2. ✓ SMS reminder with link to dashboard

---

## 🎨 UI Components & Styling

### New Components Created

**Button.tsx** - Enhanced with variants:
- `primary` - Main CTA (blue gradient)
- `secondary` - Secondary action (lime green gradient)
- `outline` - Bordered style
- `danger` - Red for destructive actions
- `ghost` - Minimal style
- `gradient` - Purple gradient (premium)

**Card.tsx** - Professional card layouts:
- `default` - Clean white card
- `gradient` - Gradient background
- `bordered` - Highlighted border
- `glass` - Frosted glass effect

**Hero.tsx** - Full-width hero section with:
- Animated background elements
- Gradient support
- Multiple CTA buttons
- Responsive design

**Features.tsx** - Feature showcase grid:
- 1-4 column layouts
- Icon support
- Hover effects
- Gradient backgrounds

**Pricing.tsx** - Pricing cards with:
- Highlighted tier option
- Feature lists
- Price display
- CTA buttons

**Toast.tsx** - Notification system:
- Success, error, info, warning types
- Auto-dismiss with custom duration
- Hook-based API (`useToast()`)

---

## 🎯 Color Palette

```
Primary Blue: #0E8FDD
Primary Dark: #0A5FA0
Primary Light: #3BA7E8

Secondary Green: #B4E74F
Secondary Dark: #94C400

Accent Black: #000000
Success Green: #10B981
Error Red: #EF4444
```

---

## 📊 Key Features

### For Customers
- ✅ Beautiful order creation flow
- ✅ Real-time email & SMS notifications
- ✅ Order tracking dashboard
- ✅ Payment processing
- ✅ Review & rating system

### For Admin
- ✅ Dashboard with analytics
- ✅ Order management
- ✅ Customer management
- ✅ Revenue tracking
- ✅ Service configuration

### For Notifications
- ✅ Professional HTML emails
- ✅ SMS confirmations
- ✅ Status updates
- ✅ In-app toast notifications

---

## 🔄 Notification Email Templates

### Order Confirmation Email
- ✓ Order number (prominent)
- ✓ Services list
- ✓ Total amount
- ✓ Pickup date
- ✓ Next steps
- ✓ Support contact

### Order Ready Email
- ✓ Ready notification
- ✓ Pickup instructions
- ✓ Link to dashboard
- ✓ Contact information

### Admin Notification
- ✓ New order alert
- ✓ Customer details
- ✓ Order amount
- ✓ Link to manage order

---

## 📲 SMS Message Format

**Order Confirmation:**
```
✓ Order Confirmed! Order #[NUMBER]. Total: $[AMOUNT]. 
Pickup: [DATE]. Thank you for choosing MDG Shoe Laundry!
```

**Order Ready:**
```
✓ Your shoes are ready for pickup! Visit your dashboard 
to confirm pickup time. Thank you for using MDG Shoe Laundry!
```

---

## 🚀 Deployment Checklist

- [ ] All `.env` variables configured
- [ ] Database migrations run
- [ ] Email service tested
- [ ] SMS service tested
- [ ] Backend builds without errors
- [ ] Frontend builds without errors
- [ ] SSL certificate installed (production)
- [ ] Domain configured
- [ ] Payment gateway integrated
- [ ] Admin access verified

---

## 🐛 Troubleshooting

### Emails Not Sending
1. Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
2. Verify Gmail app password (not regular password)
3. Check firewall/antivirus blocking SMTP
4. Look at server logs for errors

### SMS Not Working
1. Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`
2. Ensure phone number is in E.164 format: `+1234567890`
3. Check Twilio console for account limits
4. Test with Twilio test credentials first

### Database Connection Issues
1. Verify `DATABASE_URL` is correct
2. Check PostgreSQL is running
3. Test connection: `psql "postgresql://user:password@localhost:5432/mdg_shoe_laundry"`

---

## 📞 Support Contacts

- **Email**: albertmendolza295@gmail.com
- **Website**: [Your Domain]
- **Support Hours**: [Specify Hours]

---

## 📝 Notes

- All customer emails are sent to addresses in the database
- SMS sent only to verified phone numbers in Twilio
- Email templates support HTML formatting
- Notifications are logged in database
- Admin notifications sent to all users with ADMIN role

---

**Last Updated**: April 26, 2026  
**Version**: 1.0.0

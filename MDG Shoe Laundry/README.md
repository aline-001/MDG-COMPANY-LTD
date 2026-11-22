# MDG Shoe Laundry

A full-stack web platform for a shoe cleaning business. Customers book shoe cleaning, track their orders and leave reviews. Staff and admins manage orders, services, payments and customers from a dashboard.

**Built by [Aline Asimwe](https://github.com/aline-001)**: design, frontend and backend.

## Features

**For customers**
- Create an account, log in and reset a forgotten password
- Book a cleaning order for one or more pairs of shoes
- Track an order's status from booking to delivery
- Leave reviews and ratings on services
- Get email and SMS notifications about orders

**For staff and admins**
- Dashboard with orders, customers and revenue
- Update order status and manage the service catalogue
- Record and follow up payments
- Role-based access, so each user only sees what they are allowed to

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, Framer Motion |
| Backend | NestJS (TypeScript), REST API |
| Database | PostgreSQL with Prisma ORM |
| Authentication | JWT with Passport, bcrypt password hashing, role guards |
| Notifications | Email (Nodemailer) and SMS (Twilio) |
| Testing | Jest unit tests and an end-to-end test (Supertest) |
| Code quality | ESLint and Prettier |

## How it is built

```
MDG Shoe Laundry/
├── mdg-shoe-laundry-frontend/   React + TypeScript app (Vite)
│   └── src/
│       ├── app/                 Pages: home, services, auth, dashboard, admin, track order
│       ├── components/          Navbar, footer, hero, reviews, protected routes
│       ├── contexts/            Auth and notification state
│       └── lib/api.ts           API client
└── mdg-shoe-laundry-backend/    NestJS API
    ├── src/
    │   ├── auth/                Login, JWT, role guards
    │   ├── users/  orders/  services/  payments/  reviews/  notifications/
    │   └── prisma/              Database service
    └── prisma/schema.prisma     Data models
```

**Data models:** User, Service, Order, Shoe, OrderService, Payment, Review, Notification, FileUpload.

**Design:** the UI follows a consistent design system (navy, blue and lime brand colours, shared spacing and typography). See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

## Run it locally

You need Node.js 18+ and PostgreSQL.

**1. Backend** (runs on http://localhost:3000)

```bash
cd mdg-shoe-laundry-backend
npm install
```

Create a `.env` file:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/mdg_shoe_laundry
JWT_SECRET=your-secret-key
```

Then:

```bash
npx prisma migrate deploy
npm run prisma:seed   # optional: sample data
npm run start:dev
```

**2. Frontend** (runs on http://localhost:5173), in a new terminal:

```bash
cd mdg-shoe-laundry-frontend
npm install
npm run dev
```

**Run the tests** (backend):

```bash
npm test          # unit tests
npm run test:e2e  # end-to-end test
```

## More documentation

- [QUICK_START.md](./QUICK_START.md): step-by-step setup
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md): colours, typography and UI rules
- [DEPLOYMENT_IMPROVEMENTS.md](./DEPLOYMENT_IMPROVEMENTS.md): deployment notes
- [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) and [TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md)

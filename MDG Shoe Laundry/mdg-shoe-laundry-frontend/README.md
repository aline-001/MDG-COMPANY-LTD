# MDG Shoe Laundry Frontend

A modern React + TypeScript + Vite frontend application for the MDG Shoe Laundry service.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server with hot module replacement
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code quality issues

## Project Structure

```
src/
├── components/       # Reusable React components
├── pages/           # Page components
├── services/        # API and utility services
├── types/           # TypeScript type definitions
├── App.tsx          # Main App component
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## Development

This project uses:
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **ESLint** - Code quality and style checking

## API Integration

The frontend is configured to proxy API requests to `http://localhost:3000`. Any requests to `/api/*` will be forwarded to the backend server.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

## License

All rights reserved - MDG Company Ltd

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationToast } from './components/NotificationToast';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './app/page';
import ServicesPage from './app/services/page';
import ContactPage from './app/contact/page';
import AboutPage from './app/about/page';
import HowItWorksPage from './app/how-it-works/page';
import TrackOrderPage from './app/track-order/page';
import LoginPage from './app/auth/login/page';
import RegisterPage from './app/auth/register/page';
import HelpPage from './app/help/page';
import DashboardPage from './app/dashboard/page';
import NewOrderPage from './app/dashboard/new-order/page';
import OrderHistoryPage from './app/dashboard/orders';
import AccountSettingsPage from './app/dashboard/settings';
import AdminDashboard from './app/admin/dashboard';

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/help" element={<HelpPage />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/auth/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/new-order"
              element={
                <ProtectedRoute>
                  <NewOrderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/orders"
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <AccountSettingsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
        <NotificationToast />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
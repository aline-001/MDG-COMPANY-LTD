import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  // If there's no token, kick them back to login
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};
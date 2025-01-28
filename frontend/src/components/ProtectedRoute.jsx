import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!user && !token && !storedUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
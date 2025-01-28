import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AuthRedirect() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is authenticated, redirect to network dashboard
  return <Navigate to="/network/dashboard" replace />;
}

export default AuthRedirect; 
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function AdminRoute({ children }) {
  const { token, user } = useAuth();
  const disableAuth = import.meta.env.VITE_DISABLE_AUTH === "true";

  if (disableAuth) {
    return children; // Always allow in dev
  }
  
  if (!token) {
    return <Navigate to="/login" replace/>;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace/>;
  }

  return children;
}

export default AdminRoute;

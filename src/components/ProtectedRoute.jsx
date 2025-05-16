import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const hasAccess = Array.isArray(allowedRoles)
    ? allowedRoles.includes(user?.role)
    : user?.role === allowedRoles;

  return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}
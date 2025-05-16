import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, roles = [] }) {
  const { user } = useContext(AuthContext);

  // Pas connecté → on renvoie vers /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Connecté mais pas le bon rôle → on renvoie vers /unauthorized
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // OK, on rend l’enfant protégé
  return children;
}

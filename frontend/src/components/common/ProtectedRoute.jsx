import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute
 *
 * Wraps routes that require authentication and optional role checks.
 */
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = typeof user?.role === 'object' ? user?.role?.name : user?.role;

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

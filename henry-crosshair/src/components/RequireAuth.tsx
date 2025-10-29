// requireAdmin.tsx (atau modifikasi RequireAuth)
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

    
  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;

}

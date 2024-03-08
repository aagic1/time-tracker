import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/routes/AuthProvider';

export default function ProtectedRoutes() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace={true} state={{ from: location.pathname }} />
  );
}

import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/routes/AuthProvider';

export default function AuthRoutes() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // return <>{user === null ? <Outlet /> : <Navigate to="/" />}</>;
  return <>{isLoggedIn ? <Navigate to="/" /> : <Outlet />}</>;
}

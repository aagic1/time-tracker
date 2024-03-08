import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/routes/AuthProvider';

export default function AuthRoutes() {
  const { isLoggedIn } = useAuth();

  // return <>{user === null ? <Outlet /> : <Navigate to="/" />}</>;
  return isLoggedIn ? <Navigate to="/" replace={true} /> : <Outlet />;
}

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../pages/Auth/AuthProvider';

export default function AuthRoutes() {
  const { user } = useAuth();

  return <>{user === null ? <Outlet /> : <Navigate to="/" />}</>;
}

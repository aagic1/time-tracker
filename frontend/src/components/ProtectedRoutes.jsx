import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../pages/Auth/AuthProvider';

export default function ProtectedRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <>
      {user !== null ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location.pathname }} />
      )}
    </>
  );
}

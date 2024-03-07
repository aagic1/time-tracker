import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/routes/AuthProvider';

export default function ProtectedRoutes() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* {user !== null ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location.pathname }} />
      )} */}
      {isLoggedIn ? (
        <Outlet />
      ) : (
        <Navigate to="/login" replace={true} state={{ from: location.pathname }} />
      )}
    </>
  );
}

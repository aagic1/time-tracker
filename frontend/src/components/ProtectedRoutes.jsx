import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Auth/AuthProvider';

export default function ProtectedRoutes() {
  const { user, isLoggedIn } = useAuth();
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
        <Navigate to="/login" state={{ from: location.pathname }} />
      )}
    </>
  );
}

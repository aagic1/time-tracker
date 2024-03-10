import { NavLink, Outlet, useLocation } from 'react-router-dom';
import styles from './auth-layout.module.css';

export function AuthLayout() {
  const { pathname } = useLocation();
  const isLoginOrRegisterPage = pathname === '/login' || pathname === '/register';
  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        {isLoginOrRegisterPage && (
          <nav className={styles.navContainer}>
            <NavLink
              to="../login"
              className={({ isActive }) => `${isActive ? styles.active : ''} ${styles.navlink}`}
            >
              Login
            </NavLink>
            <NavLink
              to="../register"
              className={({ isActive }) => `${isActive ? styles.active : ''} ${styles.navlink}`}
            >
              Register
            </NavLink>
          </nav>
        )}
        <div className={styles.authForm}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

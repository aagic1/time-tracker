import styles from './header.module.css';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../pages/Auth/AuthProvider';
import {
  FaBullseye,
  FaRegClock,
  FaTasks,
  FaChartBar,
  FaSignOutAlt,
} from 'react-icons/fa';

export default function Header() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    const res = await fetch('http://localhost:8000/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      console.log(res);
      return await res.json();
    }

    return logout();
    // return navigate('/login');
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Time tracker</span>
      </div>
      {user !== null && (
        <>
          <div className={styles.navigation}>
            <NavLink
              className={({ isActive }) =>
                `${isActive ? styles.active : ''} ${styles.navLink}`
              }
              to="/"
            >
              <span className={styles.navText}>Activities</span>
              <span className={styles.navIcon}>
                <FaRegClock />
              </span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `${isActive ? styles.active : ''} ${styles.navLink}`
              }
              to="/records"
            >
              <span className={styles.navText}>Records</span>
              <span className={styles.navIcon}>
                <FaTasks />
              </span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `${isActive ? styles.active : ''} ${styles.navLink}`
              }
              to="goals"
            >
              <span className={styles.navText}>Goals</span>
              <span className={styles.navIcon}>
                <FaBullseye />
              </span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `${isActive ? styles.active : ''} ${styles.navLink}`
              }
              to="statistics"
            >
              <span className={styles.navText}>Statistics</span>
              <span className={styles.navIcon}>
                <FaChartBar />
              </span>
            </NavLink>
          </div>
          <div className={styles.signOutContainer}>
            <div className={styles.verticalSeparatorContainer}>
              <div className={styles.verticalSeparator}></div>
            </div>

            <button
              className={styles.signOutButton}
              type="button"
              onClick={handleLogout}
            >
              <span className={styles.navText}>Log out</span>
              <span className={styles.navIcon}>
                <FaSignOutAlt />
              </span>
            </button>
          </div>
        </>
      )}
    </header>
  );
}

import toast from 'react-hot-toast';

import styles from './app-header.module.css';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthProvider';
import { FaRegClock, FaTasks, FaSignOutAlt, FaChartBar } from 'react-icons/fa';
import { FaBullseye as Fa6Bullseye } from 'react-icons/fa6';
import { logout as serverLogout } from '../../../features/auth/api';

const headerNavigationLinks = [
  { id: 1, name: 'Activities', to: '/activities', Icon: FaRegClock },
  { id: 2, name: 'Records', to: '/records', Icon: FaTasks },
  { id: 3, name: 'Goals', to: '/goals', Icon: Fa6Bullseye },
  { id: 4, name: 'Statistics', to: '/statistics', Icon: FaChartBar },
];

export function AppHeader() {
  const { logout } = useAuth();

  async function handleLogout() {
    const { response } = await serverLogout();
    if (!response.ok) {
      return toast.error('Failed to logout', { id: 'logout-error' });
    }

    logout();
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Time tracker</span>
      </div>
      <div className={styles.navigation}>
        {headerNavigationLinks.map((link) => (
          <NavLinkHeader key={link.id} {...link} />
        ))}
      </div>
      <div className={styles.signOutContainer}>
        <div className={styles.verticalSeparatorContainer}>
          <div className={styles.verticalSeparator}></div>
        </div>

        <button className={styles.signOutButton} type="button" onClick={handleLogout}>
          <span className={styles.navText}>Log out</span>
          <span className={styles.navIcon}>
            <FaSignOutAlt />
          </span>
        </button>
      </div>
    </header>
  );
}

function NavLinkHeader({ name, to, Icon }) {
  return (
    <NavLink
      className={({ isActive }) => `${isActive ? styles.active : ''} ${styles.navLink}`}
      to={to}
    >
      <span className={styles.navText}>{name}</span>
      <span className={styles.navIcon}>
        <Icon />
      </span>
    </NavLink>
  );
}

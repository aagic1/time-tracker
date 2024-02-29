import styles from './header.module.css';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/routes/AuthProvider';
import { FaRegClock, FaTasks, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { FaBullseye as Fa6Bullseye } from 'react-icons/fa6';

const headerNavigationLinks = [
  { id: 1, name: 'Activities', to: '/', Icon: FaRegClock },
  { id: 2, name: 'Records', to: '/records', Icon: FaTasks },
  { id: 3, name: 'Goals', to: '/goals', Icon: Fa6Bullseye },
  { id: 4, name: 'Statistics', to: '/statistics', Icon: FaChartBar },
];

export default function Header() {
  const { logout } = useAuth();

  async function handleLogout() {
    const res = await fetch('http://localhost:8000/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      console.log(res);
      return await res.json();
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

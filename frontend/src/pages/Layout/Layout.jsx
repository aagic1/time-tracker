import { Outlet, NavLink } from 'react-router-dom';
import styles from './layout.module.css';
import { useAuth } from '../Auth/AuthProvider';

function Header() {
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

    logout();
    return navigate('/login');
  }

  return (
    <header className={styles.header}>
      <span className={styles.logo}>Time tracker</span>
      {user !== null && (
        <>
          <div className={styles.navigation}>
            <NavLink to="/">Activities</NavLink>
            <NavLink to="goals">Goals</NavLink>
            <NavLink to="statistics">Statistics</NavLink>
          </div>
          <button type="button" onClick={handleLogout}>
            Log out
          </button>
        </>
      )}
    </header>
  );
}

export default function Layout() {
  return (
    <div className={styles.siteWrapper}>
      {/* <div className={styles.authPage}> */}
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>Footer</footer>
      {/* </div> */}
    </div>
  );
}

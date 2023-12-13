import { Outlet, NavLink } from 'react-router-dom';
import styles from './layout.module.css';

export default function Layout() {
  return (
    <div className={styles.siteWrapper}>
      {/* <div className={styles.authPage}> */}
      <header className={styles.header}>
        <span className={styles.logo}>Time tracker</span>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>Footer</footer>
      {/* </div> */}
    </div>
  );
}

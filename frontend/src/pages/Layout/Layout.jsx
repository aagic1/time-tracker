import { Outlet } from 'react-router-dom';
import styles from './layout.module.css';
import Header from '../../components/Header/Header';

export default function Layout() {
  return (
    <div className={styles.siteWrapper}>
      <Header />
      <main className={styles.main}>
        <div className={styles.mainContainer}>
          <Outlet />
        </div>
      </main>
      <footer className={styles.footer}>© 2024 Ahmed Agić</footer>
    </div>
  );
}

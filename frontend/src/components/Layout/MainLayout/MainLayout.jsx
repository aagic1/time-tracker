import { Outlet } from 'react-router-dom';
import styles from './main-layout.module.css';
import { AppHeader, AuthHeader } from '../../Header';
import { useAuth } from '../../../features/auth/context';

export function MainLayout() {
  const { isLoggedIn } = useAuth();

  return (
    <div className={styles.siteWrapper}>
      {isLoggedIn ? <AppHeader /> : <AuthHeader />}
      <main className={styles.main}>
        <div className={styles.mainContainer}>
          <Outlet />
        </div>
      </main>
      <footer className={styles.footer}>© 2024 Ahmed Agić</footer>
    </div>
  );
}

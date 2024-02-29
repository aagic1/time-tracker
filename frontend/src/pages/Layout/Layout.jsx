import { Outlet } from 'react-router-dom';
import styles from './layout.module.css';
import Header from '../../components/Header/Header';
import { useAuth } from '../../features/auth/routes/AuthProvider';
import AuthHeader from '../../components/AuthHeader/AuthHeader';

export default function Layout() {
  const { isLoggedIn } = useAuth();

  return (
    <div className={styles.siteWrapper}>
      {isLoggedIn ? <Header /> : <AuthHeader />}
      <main className={styles.main}>
        <div className={styles.mainContainer}>
          <Outlet />
        </div>
      </main>
      <footer className={styles.footer}>© 2024 Ahmed Agić</footer>
    </div>
  );
}

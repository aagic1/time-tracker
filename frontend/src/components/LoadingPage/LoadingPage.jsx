import styles from './loading-page.module.css';
import { LoadingSpinner } from '../LoadingSpinner';

export function LoadingPage() {
  return (
    <div className={styles.pageWrapper}>
      <LoadingSpinner />
    </div>
  );
}

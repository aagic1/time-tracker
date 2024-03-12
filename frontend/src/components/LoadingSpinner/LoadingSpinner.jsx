import styles from './loading-spinner.module.css';

export function LoadingSpinner() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
  );
}

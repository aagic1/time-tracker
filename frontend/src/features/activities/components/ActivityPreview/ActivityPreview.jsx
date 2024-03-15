import styles from './activity-preview.module.css';

export function ActivityPreview({ name, color }) {
  return (
    <div
      className={styles.cardContainer}
      style={{
        backgroundColor: color,
      }}
    >
      <div className={styles.nameContainer}>
        <span>{name}</span>
      </div>
    </div>
  );
}

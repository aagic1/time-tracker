import { Link } from 'react-router-dom';
import styles from './activity-card.module.css';

export default function ActivityCard({ activity, activeRecords, onClick }) {
  return (
    <div
      className={`${styles.cardContainer} ${activity.loading ? styles.loading : ''}`}
      style={{
        backgroundColor: activity.color,
      }}
      onClick={() => onClick(activity, activeRecords)}
    >
      <div className={styles.nameContainer}>
        <span>{activity.name}</span>
      </div>
      <div className={styles.editContainer}>
        <Link
          to={activity.name}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={styles.editLink}
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

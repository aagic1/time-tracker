import { Link } from 'react-router-dom';
import styles from './activity-card.module.css';

export default function ActivityCard({ activity, allActivities }) {
  function handleClick() {}

  return (
    <Link
      className={styles.cardContainer}
      style={{
        backgroundColor: activity.color,
        // background: `linear-gradient(135deg, ${activity.color}, ${
        //   activity.color + '88'
        // })`,
      }}
      to={`activity/${activity.id}`}
      state={{ allActivities, activity }}
    >
      <span>{activity.name}</span>
    </Link>
  );
}

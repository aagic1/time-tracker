import { Link } from 'react-router-dom';
import styles from './create-activity-card.module.css';

export default function CreateActivityCard({ activity, allActivities }) {
  return (
    <Link className={styles.cardContainer} to={`activity/create`}>
      <div>+</div>
      <div>New activity</div>
    </Link>
  );
}

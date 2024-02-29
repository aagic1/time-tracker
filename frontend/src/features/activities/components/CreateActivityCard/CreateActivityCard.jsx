import { Link } from 'react-router-dom';
import styles from './create-activity-card.module.css';

export default function CreateActivityCard() {
  return (
    <Link className={styles.cardContainer} to={`activities/create`}>
      <div>+</div>
      <div>New activity</div>
    </Link>
  );
}

import { Link } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';

import styles from './create-activity-card.module.css';

export function CreateActivityCard() {
  return (
    <Link className={styles.cardContainer} to={`create`}>
      <div>
        <FiPlusCircle className={styles.plus} />
      </div>
      <div>Add</div>
    </Link>
  );
}

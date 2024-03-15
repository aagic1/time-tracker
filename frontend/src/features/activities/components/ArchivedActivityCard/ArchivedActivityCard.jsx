import { useState } from 'react';

import styles from './archived-activity-card.module.css';

export function ArchivedActivityCard({ activity, onRestore, onDelete }) {
  const [editing, setEditing] = useState(false);

  return (
    <div className={`${styles.outerContainer} ${activity.loading ? styles.loading : ''}`}>
      <div
        className={`${styles.cardContainer} ${editing ? styles.editing : ''}`}
        style={{
          backgroundColor: activity.color,
        }}
        onClick={() => setEditing(!editing)}
      >
        <div className={styles.nameContainer}>
          <span>{activity.name}</span>
        </div>
      </div>
      {editing && (
        <div className={styles.editForm}>
          <button type="button" onClick={() => onRestore(activity)}>
            Restore
          </button>
          <button type="button" onClick={() => onDelete(activity)} className={styles.deleteButton}>
            Delete
          </button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

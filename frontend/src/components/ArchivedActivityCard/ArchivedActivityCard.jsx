import { useNavigate } from 'react-router-dom';
import styles from './archived-activity-card.module.css';
import { useState } from 'react';

export default function ArchivedActivityCard({ activity }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  async function handleDelete() {
    const res = await fetch(
      `http://localhost:8000/api/v1/activities/${activity.name}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
    if (!res.ok) {
      throw new Error('Failed to delete activity with name ' + activity.name);
    }
    navigate('/');
  }

  async function handleRestore() {
    const body = {
      archived: false,
    };
    const res = await fetch(
      `http://localhost:8000/api/v1/activities/${activity.name}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to restore activity`);
    }
    navigate('/');
  }

  return (
    <div className={styles.outerContainer}>
      <div
        className={`${styles.cardContainer} ${editing && styles.editing}`}
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
          <button type="button" onClick={handleRestore}>
            Restore
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={styles.deleteButton}
          >
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

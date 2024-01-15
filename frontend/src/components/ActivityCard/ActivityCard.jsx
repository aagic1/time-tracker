import { Link, useNavigate } from 'react-router-dom';
import styles from './activity-card.module.css';
import { useState } from 'react';

export default function ActivityCard({ activity, activeRecord }) {
  const navigate = useNavigate();

  async function handleClick() {
    if (activeRecord) {
      const res = await fetch(
        `http://localhost:8000/api/v1/records/${activeRecord.recordId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            stoppedAt: new Date().toISOString(),
          }),
        }
      );
      if (!res.ok) {
        throw new Error(
          'Failed to stop record tracking by clicking on activity card'
        );
      }
      return navigate('/');
    }

    const res = await fetch('http://localhost:8000/api/v1/records', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activityId: activity.id,
        startedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to start record');
    }
    navigate('/');
  }

  return (
    <div
      className={styles.cardContainer}
      style={{
        backgroundColor: activity.color,
      }}
      onClick={handleClick}
    >
      <div className={styles.nameContainer}>
        <span>{activity.name}</span>
      </div>
      <div className={styles.editContainer}>
        <Link
          className={styles.editLink}
          onClick={(e) => {
            e.stopPropagation();
          }}
          to={`activities/${activity.name}`}
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

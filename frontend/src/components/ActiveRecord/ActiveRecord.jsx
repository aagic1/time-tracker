import { useEffect, useState } from 'react';
import styles from './active-record.module.css';
import { useNavigate } from 'react-router-dom';

export default function ActiveRecord({ record }) {
  const navigate = useNavigate();
  const [elapsedTime, setElapsedTime] = useState(
    Date.now() - new Date(record.startedAt)
  );

  const hours = Math.trunc(elapsedTime / (1000 * 60 * 60));
  const minutes = Math.trunc((elapsedTime % (1000 * 60 * 60)) / (60 * 1000));
  const seconds = Math.trunc((elapsedTime % (1000 * 60)) / 1000);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime((et) => et + 1000);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  async function handleClick() {
    const res = await fetch(
      `http://localhost:8000/api/v1/records/${record.recordId}`,
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
      throw new Error('Failed to stop record tracking');
    }
    navigate('.');
  }

  return (
    <div
      style={{ backgroundColor: '#' + record.color }}
      className={styles.card}
      onClick={handleClick}
    >
      <div className={styles.name}>{record.activityName}</div>
      <div className={styles.time}>{`${hours > 0 ? hours + 'h' : ''} ${
        minutes > 0 ? minutes + 'm' : ''
      } ${seconds}s`}</div>
    </div>
  );
}

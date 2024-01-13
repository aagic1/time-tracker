import { useEffect, useRef, useState } from 'react';
import styles from './active-record.module.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

export default function ActiveRecord({ record }) {
  const navigate = useNavigate();
  const startEpoch = useRef(new Date(record.startedAt).valueOf());
  const [elapsedTime, setElapsedTime] = useState(
    Date.now() - new Date(record.startedAt)
  );

  const hours = Math.trunc(elapsedTime / (1000 * 60 * 60));
  const minutes = Math.trunc((elapsedTime % (1000 * 60 * 60)) / (60 * 1000));
  const seconds = Math.trunc((elapsedTime % (1000 * 60)) / 1000);

  const elapsedMiliseconds = Date.now() - new Date(record.startedAt).valueOf();
  const elapsedHours = Math.trunc(elapsedMiliseconds / (1000 * 60 * 60));
  const elapsedMinutes = Math.trunc(
    (elapsedMiliseconds % (1000 * 60 * 60)) / (60 * 1000)
  );
  const elapsedSeconds = Math.trunc((elapsedMiliseconds % (1000 * 60)) / 1000);

  useEffect(() => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const timeout = 1000 - ms;
    let intervalId;
    const timeoutId = setTimeout(() => {
      setElapsedTime(Date.now() - startEpoch.current);
      intervalId = setInterval(() => {
        const now = Date.now();
        setElapsedTime(Date.now() - startEpoch.current);
      }, 1000);
    }, timeout);
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
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

  async function handleEdit(event) {
    event.stopPropagation();
    console.log('edit');
  }

  return (
    <div
      style={{ backgroundColor: '#' + record.color }}
      className={styles.card}
      onClick={handleClick}
    >
      <div className={styles.name}>{record.activityName}</div>
      <div>
        <div>{record.startedAt}</div>
        <div className={styles.time}>{`${
          elapsedHours > 0 ? elapsedHours + 'h' : ''
        } ${
          elapsedMinutes > 0 ? elapsedMinutes + 'm' : ''
        } ${elapsedSeconds}s`}</div>
      </div>
      <div className={styles.right}>
        <div className={styles.timesContainer}>
          <div className={styles.time}>{`${hours > 0 ? hours + 'h' : ''} ${
            minutes > 0 ? minutes + 'm' : ''
          } ${seconds}s`}</div>
        </div>
        <FaEdit onClick={handleEdit} className={styles.editIcon} />
      </div>
    </div>
  );
}

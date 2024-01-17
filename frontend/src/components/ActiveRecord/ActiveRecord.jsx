import styles from './active-record.module.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaCheckCircle } from 'react-icons/fa';
import useTimer from '../../hooks/useTimer';

function formatStartDateTime(startDate, elapsedHours) {
  const hoursFormated = String(startDate.getHours()).padStart(2, '0');
  const minutesFormated = String(startDate.getMinutes()).padStart(2, '0');
  let startTimeFormated = `${hoursFormated}:${minutesFormated}`;

  let startDateFormated = '';
  if (elapsedHours >= 24) {
    const monthFormated = String(startDate.getMonth() + 1).padStart(2, '0');
    const dayFormated = String(startDate.getDate()).padStart(2, '0');
    startDateFormated = `${dayFormated}.${monthFormated}.${startDate.getFullYear()}`;
  }

  return { startDateFormated, startTimeFormated };
}

export default function ActiveRecord({ record }) {
  const navigate = useNavigate();
  const timer = useTimer(new Date(record.startedAt));

  const elapsedHours = Math.trunc(timer / (1000 * 60 * 60));
  let { startDateFormated, startTimeFormated } = formatStartDateTime(
    new Date(record.startedAt),
    elapsedHours
  );

  let remainingTime;
  if (record.sessionGoal) {
    remainingTime = getRemainingGoalTime(record.sessionGoal, timer);
  }

  return (
    <div
      style={{ backgroundColor: '#' + record.color }}
      className={styles.card}
      onClick={handleClick}
    >
      <div className={styles.left}>
        <div className={styles.name}>{record.activityName}</div>
        <div className={styles.startedAtContainer}>
          <span className={styles.label}>Started at</span>
          <div className={styles.startedAt}>
            {elapsedHours >= 24 && (
              <>
                <span className={styles.startDate}>{startDateFormated}</span>
                <span className={styles.separator}> - </span>
              </>
            )}
            <span className={styles.startTime}>{startTimeFormated}</span>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.timesContainer}>
          <div className={styles.elapsedTime}>{formatTime(timer)}</div>
          {record.sessionGoal != null && (
            <div className={styles.sessionGoalContainer}>
              <div className={styles.sessionGoal}>
                <span>Session goal: </span>
                <span>{formatInterval(record.sessionGoal)}</span>
              </div>
              <div className={styles.sessionRemaining}>
                <span>{remainingTime > 0 ? 'Remaining: ' : 'Completed '}</span>
                <span>
                  {remainingTime > 0 ? (
                    formatTime(remainingTime)
                  ) : (
                    <FaCheckCircle />
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
        <FaEdit onClick={handleEdit} className={styles.editIcon} />
      </div>
    </div>
  );

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
    navigate('/');
  }

  function handleEdit(event) {
    event.stopPropagation();
    console.log('edit');
  }
}

function getRemainingGoalTime(sessionGoal, elapsedTime) {
  const remainingMS =
    ((sessionGoal.hours * 60 + sessionGoal.minutes) * 60 +
      sessionGoal.seconds) *
      1000 +
    sessionGoal.miliseconds -
    elapsedTime;

  return remainingMS;
}

function formatInterval(interval) {
  let formated = '';
  if (interval.hours) {
    formated += interval.hours + 'h ';
  }
  if (interval.minutes || formated.length > 0) {
    formated += interval.minutes + 'm ';
  }
  formated += interval.seconds + 's';
  return formated;
}

function formatTime(miliseconds) {
  const hours = Math.trunc(miliseconds / (1000 * 60 * 60));
  const minutes = Math.trunc((miliseconds % (1000 * 60 * 60)) / (60 * 1000));
  const seconds = Math.round((miliseconds % (1000 * 60)) / 1000);
  // moze pokazati 1s vise ili manje, dodatno obraditi

  return formatInterval({ hours, minutes, seconds });
}

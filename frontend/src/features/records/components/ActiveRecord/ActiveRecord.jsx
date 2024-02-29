import styles from './active-record.module.css';
import { FaEdit, FaCheckCircle, FaStopwatch } from 'react-icons/fa';
import useStopwatch from '../../../../hooks/useStopwatch';
import { useNavigate } from 'react-router-dom';

export default function ActiveRecord({
  record,
  showStopwatch,
  showEdit,
  onClick,
  showSessionDetails,
}) {
  const navigate = useNavigate();
  const timer = useStopwatch(new Date(record.startedAt));

  const elapsedHours = Math.trunc(timer / (1000 * 60 * 60));
  let { startTimeFormated } = formatStartDateAndTime(new Date(record.startedAt), elapsedHours);

  let remainingTime = 0;
  if (record.sessionGoal) {
    remainingTime = getRemainingGoalTime(record.sessionGoal, timer);
  }

  return (
    <div
      style={{ backgroundColor: '#' + record.color }}
      className={`${styles.card} ${record.fake ? styles.loading : ''}`}
      onClick={() => onClick(record)}
    >
      <div className={styles.left}>
        {showStopwatch && (
          <div className={styles.stopwatchIconContainer}>
            <FaStopwatch />
          </div>
        )}
        <div className={styles.recordDetails}>
          <div className={styles.name}>{record.activityName}</div>
          <div className={styles.startedAtContainer}>
            <span className={styles.startTime}>{startTimeFormated}</span>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.timesContainer}>
          <div className={styles.elapsedTime}>{formatTimeHMS(timer)}</div>
          {showSessionDetails && record.sessionGoal != null && (
            <div className={styles.sessionGoalContainer}>
              <div className={styles.sessionGoal}>
                <span>Goal: </span>
                <span>{formatIntervalConcise(record.sessionGoal)}</span>
              </div>
              <div className={styles.sessionRemaining}>
                <span>{remainingTime > 0 ? 'Remaining: ' : 'Completed '}</span>

                {remainingTime > 0 ? (
                  <span>{formatTimeConcise(remainingTime)}</span>
                ) : (
                  <FaCheckCircle />
                )}
              </div>
            </div>
          )}
        </div>
        {showEdit && <FaEdit onClick={(e) => handleEdit(e, record)} className={styles.editIcon} />}
      </div>
    </div>
  );

  function handleEdit(event, record) {
    event.stopPropagation();
    navigate(`/records/${record.recordId}`, { state: { from: '/' } });
  }
}

function formatStartDateAndTime(startDate, elapsedHours) {
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

function intervalToMiliseconds(interval) {
  if (!interval) {
    return 0;
  }
  return (
    interval.hours * (60 * 60 * 1000) +
    interval.minutes * (60 * 1000) +
    interval.seconds * 1000 +
    interval.miliseconds
  );
}

function getRemainingGoalTime(sessionGoal, elapsedTime) {
  return intervalToMiliseconds(sessionGoal) - elapsedTime;
}

function formatIntervalHMS(interval) {
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

function formatTimeHMS(miliseconds) {
  const hours = Math.trunc(miliseconds / (1000 * 60 * 60));
  const minutes = Math.trunc((miliseconds % (1000 * 60 * 60)) / (60 * 1000));
  const seconds = Math.round((miliseconds % (1000 * 60)) / 1000);
  // moze pokazati 1s vise ili manje, dodatno obraditi

  return formatIntervalHMS({ hours, minutes, seconds });
}

function formatTimeConcise(miliseconds) {
  const hours = Math.trunc(miliseconds / (1000 * 60 * 60));
  const minutes = Math.trunc((miliseconds % (1000 * 60 * 60)) / (60 * 1000));
  const seconds = Math.round((miliseconds % (1000 * 60)) / 1000);
  return formatIntervalConcise({ hours, minutes, seconds });
}

function formatIntervalConcise(interval) {
  let formated = '';
  if (interval.hours) {
    formated += interval.hours + 'h ' + interval.minutes + 'm';
  } else if (interval.minutes) {
    formated += interval.minutes + 'm ' + interval.seconds + 's';
  } else {
    formated += interval.seconds + 's';
  }
  return formated;
}

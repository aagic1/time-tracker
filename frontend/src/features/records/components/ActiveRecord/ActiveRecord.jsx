import styles from './active-record.module.css';
import { FaEdit, FaCheckCircle, FaStopwatch } from 'react-icons/fa';
import useStopwatch from '../../../../hooks/useStopwatch';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../../../../utils/formatDate';
import {
  getRemainingGoalTime,
  formatInterval,
  formatElapsedTime,
} from '../../../../utils/interval';

export default function ActiveRecord({
  record,
  showStopwatch,
  showEdit,
  onClick,
  showSessionDetails,
}) {
  const navigate = useNavigate();
  const elapsedTime = useStopwatch(new Date(record.startedAt));

  const startTimeFormated = formatTime(new Date(record.startedAt));

  let remainingGoalTime = 0;
  if (record.sessionGoal) {
    remainingGoalTime = getRemainingGoalTime(record.sessionGoal, elapsedTime);
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
          <div className={styles.elapsedTime}>{formatElapsedTime(elapsedTime, 'long')}</div>
          {showSessionDetails && record.sessionGoal != null && (
            <div className={styles.sessionGoalContainer}>
              <div className={styles.sessionGoal}>
                <span>Goal: </span>
                <span>{formatInterval(record.sessionGoal, 'medium')}</span>
              </div>
              <div className={styles.sessionRemaining}>
                <span>{remainingGoalTime > 0 ? 'Remaining: ' : 'Completed '}</span>

                {remainingGoalTime > 0 ? (
                  <span>{formatElapsedTime(remainingGoalTime, 'medium')}</span>
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
    navigate(`..${record.recordId}`, { state: { from: '/activities' } });
  }
}

import styles from './record-card.module.css';
import { formatTime } from '../../../../utils/format';
import { FaStopwatch } from 'react-icons/fa';
import {
  hasRecordStartedOnDate,
  hasRecordStoppedOnDate,
  formatRecordDuration,
} from '../../utils/record';

export function RecordCard({ record, forDate, onClick }) {
  const startDate = new Date(record.startedAt);
  const stopDate = new Date(record.stoppedAt);
  const startTime = hasRecordStartedOnDate(record, forDate) ? formatTime(startDate) : '00:00';
  const stopTime = hasRecordStoppedOnDate(record, forDate) ? formatTime(stopDate) : '00:00';
  const duration = formatRecordDuration(startDate, stopDate, forDate);

  return (
    <div
      style={{ backgroundColor: '#' + record.color }}
      className={styles.card}
      onClick={() => onClick(record)}
    >
      <div className={styles.left}>
        <div className={styles.name}>{record.activityName}</div>
        <div className={styles.startedAtContainer}>
          <div className={styles.timesContainer}>
            <span className={styles.time}>{startTime}</span>
            <span className={styles.separator}> - </span>
            <span className={styles.time}>{stopTime}</span>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.timesContainer}>
          <div className={styles.elapsedTime}>{duration}</div>
          {record.stoppedAt == null && <FaStopwatch />}
        </div>
      </div>
    </div>
  );
}

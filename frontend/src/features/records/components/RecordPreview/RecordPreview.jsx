import { FaBan } from 'react-icons/fa';
import useStopwatch from '../../../../hooks/useStopwatch';
import { formatElapsedTime, formatTime } from '../../../../utils/format';
import styles from './record-preview.module.css';

export function RecordPreview({ startedAt, stoppedAt, activity }) {
  const timer = useStopwatch(startedAt);
  const elapsedTime =
    stoppedAt != null
      ? formatElapsedTime(stoppedAt - startedAt, 'medium')
      : formatElapsedTime(timer, 'long');

  const name = activity ? activity.name : <FaBan />;
  const color = activity ? activity.color : '#999';

  return (
    <div className={styles.recordContainer} style={{ backgroundColor: color }}>
      <div className={styles.left}>
        <div className={styles.name}>{name}</div>
        <div className={styles.startEndTimeContainer}>
          <span>{formatTime(new Date(startedAt))}</span>
          {stoppedAt && (
            <>
              <span>-</span>
              <span>{formatTime(new Date(stoppedAt))}</span>
            </>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.elapsedTime}>{elapsedTime}</span>
      </div>
    </div>
  );
}

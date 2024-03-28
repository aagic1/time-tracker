import { FaCheckCircle, FaStopwatch } from 'react-icons/fa';
import { intervalToSeconds } from '../../../../utils/interval';
import { formatInterval } from '../../../../utils/format';
import styles from './goal-card.module.css';

export function GoalCard({ data }) {
  const elapsedTime = intervalToSeconds(data.totalTime);
  const goalTime = intervalToSeconds(data.goalTime);
  const percentage = Math.trunc((elapsedTime / goalTime) * 100);

  const totalTimeString = formatInterval(data.totalTime, 'short');
  const goalTimeString = formatInterval(data.goalTime, 'short');

  return (
    <div className={styles.goalCardContainer} style={{ backgroundColor: '#' + data.color }}>
      <div className={styles.nameContainer}>
        {data.hasActiveRecord && <FaStopwatch />}
        <span>{data.name}</span>
      </div>
      <div className={styles.statsContainer}>
        <div className={styles.timeContainer}>
          <div className={styles.elapsedTimeContainer}>{totalTimeString}</div>
          <div className={styles.goalTimeContainer}>
            <div className={styles.goalTimeString}>{'goal - ' + goalTimeString}</div>
          </div>
        </div>
        <div className={styles.verticalLine}></div>
        <div className={styles.percentageContainer}>
          <span className={styles.result}>
            {percentage >= 100 ? <FaCheckCircle /> : percentage + '%'}
          </span>
        </div>
      </div>
    </div>
  );
}

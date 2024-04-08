import styles from './statistics-card.module.css';
import { formatElapsedTime } from '../../../../utils/format';

export function StatisticsCard({ data, percentage, showPercentage = true }) {
  return (
    <div className={styles.statisticCard} style={{ backgroundColor: data.color }}>
      <div className={styles.left}>
        <div className={styles.nameContainer}>{data.activityName}</div>
      </div>
      <div className={styles.right}>
        <div className={styles.elapsedTimeContainer}>
          {formatElapsedTime(data.totalTime, 'short')}
        </div>
        {showPercentage && (
          <>
            <div className={styles.verticalLine}></div>
            <div className={styles.percentageContainer}>
              <div>{(percentage || '<1') + '%'}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

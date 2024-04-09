import { StatisticsCard } from '../StatisticsCard/StatisticsCard';
import styles from './statistics-card-list.module.css';

export function StatisticsCardList({ stats, sumOfTotalTimes }) {
  return (
    <div className={styles.statisticCardsContainer}>
      {stats.toReversed().map((entry) => (
        <StatisticsCard key={entry.activityId} data={entry} percentage={entry.percent} />
      ))}
      <div className={styles.horizontalLine}></div>
      <StatisticsCard
        data={{ totalTime: sumOfTotalTimes, color: '#fff', activityName: 'Total time' }}
        showPercentage={false}
      />
    </div>
  );
}

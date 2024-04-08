import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useLoaderData } from 'react-router-dom';

import styles from './statistics.module.css';
import { StatisticsCard } from '../../components/StatisticsCard';
import { roundPercentagesToAddUpTo100, compareStats } from '../../utils';
import { getStatistics } from '../../api';

export function Statistics() {
  const loaderData = useLoaderData();

  let stats = loaderData.stats;

  const sumOfTotalTimes = stats.reduce(
    (accumulator, currentData) => accumulator + currentData.totalTime,
    0
  );

  stats = stats.map((entry) => ({
    ...entry,
    percent: (entry.totalTime / sumOfTotalTimes) * 100,
  }));
  stats = roundPercentagesToAddUpTo100(stats).toSorted(compareStats);

  return (
    <div className={styles.pageWrapper}>
      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie
            animationDuration={0}
            data={stats}
            dataKey="totalTime"
            innerRadius={60}
            outerRadius={85}
            fill="#8884d8"
            paddingAngle={3}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={450}
          >
            {stats.map((entry) => (
              <Cell key={`cell-${entry.activityId}`} fill={entry.color} className={styles.cell} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className={styles.statisticCardsContainer}>
        {stats.toReversed().map((entry) => (
          <StatisticsCard key={entry.activityId} data={entry} percentage={entry.percent} />
        ))}
      </div>
    </div>
  );
}

export async function statisticsLoader() {
  const currentDate = new Date();
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);

  const { response, data } = await getStatistics(new Date().getTimezoneOffset(), {
    from: startOfDay,
    to: endOfDay,
  });

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
}

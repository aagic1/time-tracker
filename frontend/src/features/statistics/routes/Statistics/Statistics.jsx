import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import styles from './statistics.module.css';
import { StatisticsCard } from '../../components/StatisticsCard';
import { roundPercentagesToAddUpTo100 } from '../../utils';

const data = [
  { activityName: 'Activity 1', elapsedTime: 1000 * 60 * 10, color: '#0088FE' },
  { activityName: 'Activity 2', elapsedTime: 1000 * 60 * 60 * 2, color: '#2FC9cF' },
  { activityName: 'Activity 3', elapsedTime: 1000 * 600, color: '#00C49F' },
  { activityName: 'Activity 4', elapsedTime: 1000 * 60 * 15, color: '#FF8042' },
];

const total = data.reduce((accumulator, currentValue) => accumulator + currentValue.elapsedTime, 0);

export function Statistics() {
  const percentages = data.map((entry) => (entry.elapsedTime / total) * 100);
  const percentagesRounded = roundPercentagesToAddUpTo100(percentages);

  return (
    <div className={styles.pageWrapper}>
      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie
            animationDuration={0}
            data={data}
            innerRadius={60}
            outerRadius={85}
            fill="#8884d8"
            paddingAngle={1}
            dataKey="elapsedTime"
            cx="50%"
            cy="50%"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className={styles.statisticCardsContainer}>
        {data
          .toSorted((a, b) => b.elapsedTime - a.elapsedTime)
          .map((entry, index) => (
            <StatisticsCard key={entry.name} data={entry} percentage={percentagesRounded[index]} />
          ))}
      </div>
    </div>
  );
}

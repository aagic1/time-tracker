import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import styles from './statistics.module.css';
import { formatElapsedTime } from '../../../../utils/format';

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
      {data
        .toSorted((a, b) => b.elapsedTime - a.elapsedTime)
        .map((entry, index) => (
          <StatisticsCard key={entry.name} data={entry} percentage={percentagesRounded[index]} />
        ))}
    </div>
  );
}

function StatisticsCard({ data, percentage }) {
  return (
    <div className={styles.statsCard} style={{ backgroundColor: data.color }}>
      <div className={styles.left}>
        <div className={styles.nameContainer}>{data.activityName}</div>
      </div>
      <div className={styles.right}>
        <div className={styles.elapsedTimeContainer}>
          {formatElapsedTime(data.elapsedTime, 'short')}
        </div>
        <div className={styles.verticalLine}></div>
        <div className={styles.percentageContainer}>
          <div className={styles.result}>{percentage + '%'}</div>
        </div>
      </div>
    </div>
  );
}

// round percentages so that their sum equals exactly 100
function roundPercentagesToAddUpTo100(percentages) {
  // calulate total while ignoring decimal parts of percentages
  const total = percentages.reduce(
    (accumulutar, currentValue) => accumulutar + Math.trunc(currentValue),
    0
  );
  // this will indicate how many percentages will have to be rounded up
  const remainder = 100 - total;

  // sort by decimal part descending
  const sortedByDecimalPart = percentages.toSorted((a, b) => getDecimalPart(b) - getDecimalPart(a));

  // truncate decimal parts of percentages
  const truncatedPercentages = sortedByDecimalPart.map((v) => Math.trunc(v));

  // increase truncated percentages that had the larges decimal part
  for (let i = 0; i < remainder; i++) {
    truncatedPercentages[i] = truncatedPercentages[i] + 1;
  }

  return truncatedPercentages.toSorted((a, b) => b - a);
}

function getDecimalPart(number) {
  let numberString = number.toString();
  let decimalSeparator;
  if (numberString.indexOf('.') !== -1) {
    decimalSeparator = '.';
  } else if (numberString.indexOf(',') !== -1) {
    decimalSeparator = ',';
  }

  if (!decimalSeparator) {
    return 0;
  }
  return Number('0.' + numberString.split(decimalSeparator)[1]);
}

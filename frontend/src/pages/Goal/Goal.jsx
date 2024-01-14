import { useLoaderData } from 'react-router-dom';
import styles from './goal.module.css';
import HorizontalSeparator from '../../components/HorizontalSeparator/HorizontalSeparator';

export async function loader() {
  const result = await fetch(
    `http://localhost:8000/api/v1/records/goals?timezoneOffset=${new Date().getTimezoneOffset()}`,
    {
      credentials: 'include',
    }
  );

  if (!result.ok) {
    throw new Error('Failed to load current goals');
  }

  return await result.json();
}

export default function Goal() {
  const goalsData = useLoaderData();
  console.log(goalsData);
  const dayGoalsData = goalsData.filter(
    (goalData) => goalData.goalName === 'dayGoal'
  );
  const weekGoalsData = goalsData.filter(
    (goalData) => goalData.goalName === 'weekGoal'
  );
  const monthGoalsData = goalsData.filter(
    (goalData) => goalData.goalName === 'monthGoal'
  );

  return (
    <div className={styles.h}>
      <HorizontalSeparator className={styles.separator} text={'Today'} />
      <div className={styles.goalsContainer}>
        {dayGoalsData.map((gd) => (
          <GoalCard
            key={gd.id + gd.goalName}
            data={gd}
            style={{ backgroundColor: '#' + gd.color }}
          />
        ))}
      </div>
      <HorizontalSeparator className={styles.separator} text={'This week'} />
      <div className={styles.goalsContainer}>
        {weekGoalsData.map((gd) => (
          <GoalCard
            key={gd.id + gd.goalName}
            data={gd}
            style={{ backgroundColor: '#' + gd.color }}
          />
        ))}
      </div>
      <HorizontalSeparator className={styles.separator} text={'This month'} />
      <div className={styles.goalsContainer}>
        {monthGoalsData.map((gd) => (
          <GoalCard key={gd.id + gd.goalName} data={gd} />
        ))}
      </div>
    </div>
  );
}

function GoalCard({ data }) {
  console.log('data');
  console.log(data);
  const days = data.totalTime?.days || 0;
  const hours = data.totalTime?.hours || 0;
  const minutes = data.totalTime?.minutes || 0;
  const seconds = data.totalTime?.seconds || 0;

  let intervalString = '';
  if (hours) {
    intervalString += days * 24 + hours + 'h ';
  }
  if (minutes || hours || days) {
    intervalString += minutes + 'm ';
  }
  if (seconds || minutes || hours || days) {
    intervalString += seconds + 's';
  }

  return (
    <div
      className={styles.goalCardContainer}
      style={{ backgroundColor: '#' + data.color }}
    >
      <div className={styles.nameContainer}>
        <span>{data.name}</span>
      </div>
      <div className={styles.timeContainer}>
        <div className={styles.accomplished}>{intervalString}</div>
        <div className={styles.goal}>
          <div className={styles.label}>goal</div>
          <div className={styles.time}>
            {data.goalTime.hours ? data.goalTime.hours + 'h ' : ''}
            {data.goalTime.minutes
              ? data.goalTime.minutes + 'm '
              : data.goalTime.Hours
              ? '0m'
              : ''}
            {data.goalTime.seconds ? data.goalTime.seconds + 's' : ''}
          </div>
        </div>
        <div className={styles.remaining}></div>
      </div>
    </div>
  );
}

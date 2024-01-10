import { useLoaderData } from 'react-router-dom';
import styles from './goal.module.css';

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
      <div className={styles.lineContainer}>
        <div className={styles.line}></div>
        <div className={styles.lineText}>Today</div>
        <div className={styles.line}></div>
      </div>
      <div className={styles.goalsContainer}>
        {dayGoalsData.map((gd) => (
          <GoalCard data={gd} style={{ backgroundColor: '#' + gd.color }} />
        ))}
      </div>
      <div className={styles.lineContainer}>
        <div className={styles.line}></div>
        <div className={styles.lineText}>This week</div>
        <div className={styles.line}></div>
      </div>
      <div className={styles.goalsContainer}>
        {weekGoalsData.map((gd) => (
          <GoalCard data={gd} style={{ backgroundColor: '#' + gd.color }} />
        ))}
      </div>
      <div className={styles.lineContainer}>
        <div className={styles.line}></div>
        <div className={styles.lineText}>This month</div>
        <div className={styles.line}></div>
      </div>
      <div className={styles.goalsContainer}>
        {monthGoalsData.map((gd) => (
          <GoalCard key={'' + gd.id + gd.goalName} data={gd} />
        ))}
      </div>
    </div>
  );
}

function GoalCard({ data }) {
  // console.log(data);
  const hours = data.totalTime?.hours;
  const minutes = data.totalTime?.minutes;
  const seconds = data.totalTime?.seconds;

  return (
    <div
      className={styles.goalCardContainer}
      style={{ backgroundColor: '#' + data.color }}
    >
      <div className={styles.nameContainer}>
        <span>{data.name}</span>
      </div>
      <div className={styles.timeContainer}>
        <div className={styles.accomplished}>
          {hours ? hours + 'h ' : ''}
          {minutes ? minutes + 'm ' : ''}
          {''}
          {seconds ? seconds + 's' : ''}
        </div>
        <div className={styles.goal}>
          <div className={styles.label}>goal</div>
          <div className={styles.time}>
            {data.goalTime.hours ? data.goalTime.hours + 'h ' : ''}
            {data.goalTime.minutes ? data.goalTime.minutes + 'm ' : ''}
            {''}
            {data.goalTime.seconds ? data.goalTime.seconds + 's' : ''}
          </div>
        </div>
        <div className={styles.remaining}></div>
      </div>
    </div>
  );
}

import { useLoaderData } from 'react-router-dom';
import styles from './goal.module.css';
import HorizontalSeparator from '../../components/HorizontalSeparator/HorizontalSeparator';
import { FaCheckCircle, FaStopwatch } from 'react-icons/fa';
import useStopwatch from '../../hooks/useStopwatch';

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
  const { goals, measuredAt } = useLoaderData();
  const dayGoals = goals.filter((goal) => goal.goalName === 'dayGoal');
  const weekGoals = goals.filter((goal) => goal.goalName === 'weekGoal');
  const monthGoals = goals.filter((goal) => goal.goalName === 'monthGoal');

  return (
    <div className={styles.h}>
      {dayGoals.length > 0 && <HorizontalSeparator className={styles.separator} text={'Today'} />}
      <div className={styles.goalsContainer}>
        {dayGoals.map((goal) =>
          goal.hasActiveRecord ? (
            <ActiveGoalCard key={goal.id + goal.goalName} data={goal} measuredAt={measuredAt} />
          ) : (
            <GoalCard key={goal.id + goal.goalName} data={goal} />
          )
        )}
      </div>

      {weekGoals.length > 0 && (
        <HorizontalSeparator className={styles.separator} text={'This week'} />
      )}
      <div className={styles.goalsContainer}>
        {weekGoals.map((goal) =>
          goal.hasActiveRecord ? (
            <ActiveGoalCard key={goal.id + goal.goalName} data={goal} measuredAt={measuredAt} />
          ) : (
            <GoalCard key={goal.id + goal.goalName} data={goal} />
          )
        )}
      </div>
      {monthGoals.length > 0 && (
        <HorizontalSeparator className={styles.separator} text={'This month'} />
      )}
      <div className={styles.goalsContainer}>
        {monthGoals.map((goal) =>
          goal.hasActiveRecord ? (
            <ActiveGoalCard key={goal.id + goal.goalName} data={goal} measuredAt={measuredAt} />
          ) : (
            <GoalCard key={goal.id + goal.goalName} data={goal} />
          )
        )}
      </div>
    </div>
  );
}

function intervalToString(interval) {
  const hours = interval.hours;
  const minutes = interval.minutes;
  const seconds = interval.seconds;

  let timeString = '';
  if (hours) {
    timeString += hours + 'h ';
  }
  if (minutes || hours) {
    timeString += minutes + 'm ';
  }
  if (!minutes && !hours) {
    timeString += seconds + 's';
  }

  return timeString;
}

function intervalToSeconds(interval) {
  return interval.hours * 60 * 60 + interval.minutes * 60 + interval.seconds;
}

function intervalToMiliseconds(interval) {
  return (
    interval.miliseconds +
    1000 * (interval.hours * 60 * 60 + interval.minutes * 60 + interval.seconds)
  );
}

function getIntervalFromSeconds(totalSeconds) {
  const hours = Math.trunc(totalSeconds / (60 * 60));
  const minutes = Math.trunc((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

function ActiveGoalCard({ data, measuredAt }) {
  const totalTime = intervalToMiliseconds(data.totalTime);
  const timer = useStopwatch(new Date(measuredAt));
  const elapsedTime = Math.round((totalTime + timer) / 1000);
  const elapsedInterval = getIntervalFromSeconds(elapsedTime);

  return <GoalCard data={{ ...data, totalTime: elapsedInterval }} />;
}

function GoalCard({ data }) {
  const totalTime = intervalToSeconds(data.totalTime);
  const goalTime = intervalToSeconds(data.goalTime);
  const percentage = Math.trunc((totalTime / goalTime) * 100);

  const totalTimeString = intervalToString(getIntervalFromSeconds(totalTime));
  const goalTimeString = intervalToString(data.goalTime);

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

            {/* <div className={styles.remaining}></div> */}
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

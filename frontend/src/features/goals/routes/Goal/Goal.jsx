import { useLoaderData } from 'react-router-dom';

import styles from './goal.module.css';
import { HorizontalSeparator } from '../../../../components/HorizontalSeparator';
import { getGoalData } from '../../api';
import { GoalCard } from '../../components/GoalCard';
import { ActiveGoalCard } from '../../components/ActiveGoalCard';

export function Goal() {
  const { goals, measuredAt } = useLoaderData();

  const dayGoals = goals.filter((goal) => goal.goalName === 'dayGoal');
  const weekGoals = goals.filter((goal) => goal.goalName === 'weekGoal');
  const monthGoals = goals.filter((goal) => goal.goalName === 'monthGoal');

  return (
    <div className={styles.pageWrapper}>
      {dayGoals.length > 0 && <GoalList goals={dayGoals} measuredAt={measuredAt} caption="Today" />}
      {weekGoals.length > 0 && (
        <GoalList goals={weekGoals} measuredAt={measuredAt} caption="This week" />
      )}
      {monthGoals.length > 0 && (
        <GoalList goals={monthGoals} measuredAt={measuredAt} caption="This month" />
      )}
    </div>
  );
}

export async function goalLoader() {
  const { response, data } = await getGoalData();
  if (!response.ok) {
    throw new Error('Failed to load current goals');
  }

  return data;
}

function GoalList({ goals, measuredAt, caption }) {
  return (
    <>
      <HorizontalSeparator className={styles.separator} text={caption} />
      <div className={styles.goalsContainer}>
        {goals.map((goal) =>
          goal.hasActiveRecord ? (
            <ActiveGoalCard key={goal.id + goal.goalName} data={goal} measuredAt={measuredAt} />
          ) : (
            <GoalCard key={goal.id + goal.goalName} data={goal} />
          )
        )}
      </div>
    </>
  );
}

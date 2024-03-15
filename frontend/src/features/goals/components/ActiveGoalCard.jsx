import useStopwatch from '../../../hooks/useStopwatch';
import { intervalToMiliseconds, secondsToInterval } from '../utils';
import { GoalCard } from './GoalCard';

export function ActiveGoalCard({ data, measuredAt }) {
  const totalTime = intervalToMiliseconds(data.totalTime);
  const timer = useStopwatch(new Date(measuredAt));
  const elapsedTime = Math.round((totalTime + timer) / 1000);
  const elapsedInterval = secondsToInterval(elapsedTime);

  return <GoalCard data={{ ...data, totalTime: elapsedInterval }} />;
}

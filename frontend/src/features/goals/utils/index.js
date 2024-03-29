import { intervalToMiliseconds } from '../../../utils/interval';

function getRemainingGoalTime(goal, elapsedTime) {
  return intervalToMiliseconds(goal) - elapsedTime;
}

export { getRemainingGoalTime };

import { GoalInterval } from './activity.types';

export function toStringFromInterval(interval: GoalInterval | undefined | null) {
  if (!interval) {
    return interval;
  }
  return `${interval.hours ?? '00'}:${interval.minutes ?? '00'}:${interval.seconds ?? '00'}`;
}

import { ActivityRecord } from './record.types';

export function calculateElapsedTime(
  record: ActivityRecord,
  dateFrom: Date | undefined,
  dateTo: Date | undefined
) {
  let currentDateTime = new Date();

  let lowerBound: Date;
  let upperBound: Date;

  // this code is bad, make it easier to understand
  if (!dateFrom) {
    lowerBound = record.startedAt;
  } else if (record.startedAt < dateFrom) {
    lowerBound = dateFrom;
  } else {
    lowerBound = record.startedAt;
  }

  if (!record.stoppedAt) {
    if (!dateTo || dateTo > currentDateTime) {
      upperBound = currentDateTime;
    } else {
      upperBound = dateTo;
    }
  } else {
    if (!dateTo) {
      upperBound = record.stoppedAt;
    } else {
      upperBound = dateTo;
    }
  }

  return upperBound.getTime() - lowerBound.getTime();
}

import { ActivityRecord } from './record.types';

export function calculateElapsedTime(
  record: ActivityRecord,
  dateFrom: Date | undefined,
  dateTo: Date | undefined
) {
  const startDate = getStartDate(dateFrom, record.startedAt);
  const endDate = getEndDate(dateTo, record.stoppedAt);

  if (startDate > endDate) {
    return 0; // or throw exception
  }

  return endDate.getTime() - startDate.getTime();
}

function getStartDate(dateFrom: Date | undefined, startedAt: Date) {
  // DETERMINE START DATE
  // 1st scenario
  // TIMELINE:
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - dateFrom  - - - - - - - -
  // - - record.startedAt  - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // _____________________________________________________
  // record.startedAt happened BEFORE the lower limit ~dateFrom~
  // => take dateFrom as the start time

  // 2nd scenario
  // TIMELINE:
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - record.startedAt  - - - - - - - -
  // - - dateFrom  - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // _____________________________________________________
  // record.startedAt happened AFTER the lower limit ~dateFrom~
  // => take record.startedAt as the start time

  // 3rd scenario
  // TIMELINE:
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - record.startedAt  - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // there is no specified lower limit
  // => take record.startedAt as the start time

  if (dateFrom) {
    // scenario 1 and 2
    return maxDate(dateFrom, startedAt);
  } else {
    // scenario 3
    return startedAt;
  }
}

function getEndDate(dateTo: Date | undefined, stoppedAt: Date | null) {
  const dateNow = new Date();
  // DETERMINE STOP DATE
  // 1st scenario
  // TIMELINE:
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - dateTo  - - - - - - - -
  // - - record.stoppedAt  - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // _____________________________________________________
  // record.stoppedAt happened BEFORE the upper limit ~dateTo~
  // => take record.stoppedAt as the stop time

  // 2nd scenario
  // TIMELINE:
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - record.stoppedAt  - - - - - - - -
  // - - dateTo  - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // _____________________________________________________
  // record.stoppedAt happened AFTER the upper limit ~dateTo~
  // => take dateTo as the stop time

  // 3rd scenario
  // TIMELINE:
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - dateTo  - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // _____________________________________________________
  // the record is still active (record.stoppedAt == null)
  // => take the smaller value between the current date (dateNow) and the upper limit (dateTo)

  // 4th scenario
  // TIMELINE:
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - record.stoppedAt  - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // _____________________________________________________
  // there is no specified upper limit
  // => take record.stoppedAt as the stop time or the current date (dateNow) if the record is still active (record.stoppedAt == null)

  if (dateTo) {
    // scenario 1, 2, and 3
    return stoppedAt ? minDate(stoppedAt, dateTo) : minDate(dateNow, dateTo);
  } else {
    // scenario 4
    return stoppedAt ? stoppedAt : dateNow;
  }
}

function maxDate(...dates: Date[]) {
  return dates.reduce((max, current) => (current > max ? current : max), dates[0]);
}

function minDate(...dates: Date[]) {
  return dates.reduce((min, current) => (current < min ? current : min), dates[0]);
}

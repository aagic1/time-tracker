import { formatElapsedTime } from '../../../utils/format';
import { getEndOf, getStartOf } from '../../statistics/utils';

// PUBLIC API
// __________

function hasRecordStartedOnDate(record, date) {
  const startedAt = new Date(record.startedAt);
  return isSameDate(startedAt, date);
}

function hasRecordStoppedOnDate(record, date) {
  const stoppedAt = new Date(record.stoppedAt);
  return isSameDate(stoppedAt, date);
}

function formatRecordDuration(startedAt, stoppedAt, forDate) {
  const startOfDay = getStartOf('day', forDate);
  const endOfDay = getEndOf('day', forDate);

  const upperBound = stoppedAt < endOfDay ? stoppedAt : endOfDay;
  const lowerBound = startedAt > startOfDay ? startedAt : startOfDay;
  const elapsedTime = upperBound - lowerBound;

  return formatElapsedTime(elapsedTime, 'short');
}

// API EXPORT
// __________
export { hasRecordStartedOnDate, hasRecordStoppedOnDate, formatRecordDuration };

// PRIVATE FUNCTIONS
// _________________

function isSameDate(date1, date2) {
  return (
    date1.getFullYear() == date2.getFullYear() &&
    date1.getMonth() == date2.getMonth() &&
    date1.getDate() == date2.getDate()
  );
}

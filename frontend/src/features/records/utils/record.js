import { formatElapsedTime } from '../../../utils/format';

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
  const startOfDay = getStartOfDay(forDate);
  const endOfDay = getEndOfDay(forDate);

  const upperBound = stoppedAt < endOfDay ? stoppedAt : endOfDay;
  const lowerBound = startedAt > startOfDay ? startedAt : startOfDay;
  const elapsedTime = upperBound - lowerBound;

  const MILISECONDS_PER_DAY = 86_400_000;
  if (elapsedTime >= MILISECONDS_PER_DAY - 1) {
    return '24h 0m';
  }
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

function getStartOfDay(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

function getEndOfDay(date) {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  endOfDay.setMilliseconds(endOfDay.getMilliseconds() + 1);
  return endOfDay;
}

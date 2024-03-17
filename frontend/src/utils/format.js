import { milisecondsToInterval } from './interval';

// PUBLIC API
// __________

function formatDate(date) {
  const monthFormated = String(date.getMonth() + 1).padStart(2, '0');
  const dayFormated = String(date.getDate()).padStart(2, '0');
  return `${dayFormated}.${monthFormated}.${date.getFullYear()}`;
}

function formatTime(date) {
  const hoursFormated = String(date.getHours()).padStart(2, '0');
  const minutesFormated = String(date.getMinutes()).padStart(2, '0');
  return `${hoursFormated}:${minutesFormated}`;
}

// there are 3 length options to which to format the interval: long, medium and short
function formatInterval(interval, length = 'medium') {
  switch (length) {
    case 'long':
      return formatIntervalLong(interval);
    case 'medium':
      return formatIntervalMedium(interval);
    case 'short':
      return formatIntervalShort(interval);
    default:
      throw Error('Invalid format interval length option');
  }
}

function formatElapsedTime(miliseconds, length = 'medium') {
  return formatInterval(milisecondsToInterval(miliseconds), length);
}

function dateToISOStringWithoutTime(date) {
  return date.toISOString().split('T')[0];
}

// PUBLIC API EXPORT
// _________________
export { formatDate, formatTime, formatInterval, formatElapsedTime, dateToISOStringWithoutTime };

// Private functions
// _________________

// only show seconds when elapsed time is less than 1 minute
// possible formats: 'hh:mm', 'mm', 'ss'
function formatIntervalShort(interval) {
  const hours = interval.hours;
  const minutes = interval.minutes;
  const seconds = interval.seconds;

  let formatted = '';
  if (hours) {
    formatted += hours + 'h ';
  }
  if (minutes || hours) {
    formatted += minutes + 'm ';
  }
  if (!minutes && !hours) {
    formatted += seconds + 's';
  }

  return formatted;
}

// show at most two time fields
// possible formats: 'hh:mm', 'mm:ss', 'ss'
function formatIntervalMedium(interval) {
  let formatted = '';
  if (interval.hours) {
    formatted += interval.hours + 'h ' + interval.minutes + 'm';
  } else if (interval.minutes) {
    formatted += interval.minutes + 'm ' + interval.seconds + 's';
  } else {
    formatted += interval.seconds + 's';
  }
  return formatted;
}

// show all time fields
// possible formats: 'hh:mm:ss', 'mm:ss', 'ss'
function formatIntervalLong(interval) {
  let formatted = '';
  if (interval.hours) {
    formatted += interval.hours + 'h ';
  }
  if (interval.minutes || interval.hours) {
    formatted += interval.minutes + 'm ';
  }
  formatted += interval.seconds + 's';
  return formatted;
}

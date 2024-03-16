// PUBLIC
function intervalToSeconds(interval) {
  return interval.hours * 60 * 60 + interval.minutes * 60 + interval.seconds;
}

function intervalToMiliseconds(interval) {
  return interval.miliseconds + 1000 * intervalToSeconds(interval);
}

function secondsToInterval(totalSeconds) {
  const hours = Math.trunc(totalSeconds / (60 * 60));
  const minutes = Math.trunc((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
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

function milisecondsToInterval(miliseconds) {
  const hours = Math.trunc(miliseconds / (1000 * 60 * 60));
  const minutes = Math.trunc((miliseconds % (1000 * 60 * 60)) / (60 * 1000));
  const seconds = Math.round((miliseconds % (1000 * 60)) / 1000);
  const remainingMiliseconds = miliseconds % 1000;
  return { hours, minutes, seconds, miliseconds: remainingMiliseconds };
}

function getRemainingGoalTime(goal, elapsedTime) {
  return intervalToMiliseconds(goal) - elapsedTime;
}

export {
  intervalToSeconds,
  intervalToMiliseconds,
  secondsToInterval,
  formatInterval,
  formatElapsedTime,
  getRemainingGoalTime,
};

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

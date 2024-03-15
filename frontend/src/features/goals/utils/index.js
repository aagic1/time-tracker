function intervalToString(interval) {
  const hours = interval.hours;
  const minutes = interval.minutes;
  const seconds = interval.seconds;

  let timeString = '';
  if (hours) {
    timeString += hours + 'h ';
  }
  if (minutes || hours) {
    timeString += minutes + 'm ';
  }
  if (!minutes && !hours) {
    timeString += seconds + 's';
  }

  return timeString;
}

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

export { intervalToString, intervalToSeconds, intervalToMiliseconds, secondsToInterval };

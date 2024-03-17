// PUBLIC API
// __________
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

function milisecondsToInterval(miliseconds) {
  const hours = Math.trunc(miliseconds / (1000 * 60 * 60));
  const minutes = Math.trunc((miliseconds % (1000 * 60 * 60)) / (60 * 1000));
  const seconds = Math.round((miliseconds % (1000 * 60)) / 1000);
  const remainingMiliseconds = miliseconds % 1000;
  return { hours, minutes, seconds, miliseconds: remainingMiliseconds };
}

// PUBLIC API EXPORT
// _________________
export { intervalToSeconds, intervalToMiliseconds, secondsToInterval, milisecondsToInterval };

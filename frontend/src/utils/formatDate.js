function formatStartDate(date) {
  const monthFormated = String(date.getMonth() + 1).padStart(2, '0');
  const dayFormated = String(date.getDate()).padStart(2, '0');
  return `${dayFormated}.${monthFormated}.${date.getFullYear()}`;
}

function formatStartTime(date) {
  const hoursFormated = String(date.getHours()).padStart(2, '0');
  const minutesFormated = String(date.getMinutes()).padStart(2, '0');
  return `${hoursFormated}:${minutesFormated}`;
}

export { formatStartDate, formatStartTime };

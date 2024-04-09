function getStartOf(period, date) {
  if (period === 'day') {
    return getStartOfDay(date);
  } else if (period === 'week') {
    return getStartOfWeek(date);
  } else if (period === 'month') {
    return getStartOfMonth(date);
  } else {
    return getStartOfYear(date);
  }
}

function getEndOf(period, date) {
  if (period === 'day') {
    return getEndOfDay(date);
  } else if (period === 'week') {
    return getEndOfWeek(date);
  } else if (period === 'month') {
    return getEndOfMonth(date);
  } else {
    return getEndOfYear(date);
  }
}

const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function getStartOfDay(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

function getEndOfDay(date) {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 59);
  return endOfDay;
}

function getStartOfWeek(date) {
  let dayOfWeek = date.getDay();
  if (dayOfWeek === 0) {
    dayOfWeek = 7;
  }
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);
  return getStartOfDay(startOfWeek);
}

function getEndOfWeek(date) {
  let dayOfWeek = date.getDay();
  if (dayOfWeek === 0) {
    dayOfWeek = 7;
  }
  const endOfWeek = new Date(date);
  endOfWeek.setDate(date.getDate() + (7 - dayOfWeek));
  return getEndOfDay(endOfWeek);
}

function getStartOfMonth(date) {
  const startOfMonth = new Date(date);
  startOfMonth.setDate(1);
  return getStartOfDay(startOfMonth);
}

function getEndOfMonth(date) {
  const endOfMonth = new Date(date);
  endOfMonth.setDate(getDaysInMonth(date));
  return getEndOfDay(endOfMonth);
}

function getStartOfYear(date) {
  const startOfYear = new Date(date);
  startOfYear.setMonth(0, 1);
  return getStartOfDay(startOfYear);
}

function getEndOfYear(date) {
  const endOfYear = new Date(date);
  endOfYear.setMonth(11, 31);
  return getEndOfDay(endOfYear);
}

function getDaysInMonth(date) {
  if (date.getMonth() === 1 && isLeapYear(date.getFullYear())) {
    return 29;
  }
  return daysPerMonth[date.getMonth()];
}

function isLeapYear(year) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

function isInFuture(date) {
  return date > new Date();
}

export { getStartOf, getEndOf, isInFuture };

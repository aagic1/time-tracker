import { DateObject } from './record.types';

export function getDayNumber(day: string) {
  if (day.toUpperCase() === 'MON') {
    return 1;
  } else if (day.toUpperCase() === 'TUE') {
    return 2;
  } else if (day.toUpperCase() === 'WED') {
    return 3;
  } else if (day.toUpperCase() === 'THU') {
    return 4;
  } else if (day.toUpperCase() === 'FRI') {
    return 5;
  } else if (day.toUpperCase() === 'SAT') {
    return 6;
  } else if (day.toUpperCase() === 'SUN') {
    return 7;
  }
  return -1;
}

function getTimezoneString(timezoneOffset: number) {
  if (timezoneOffset === 0) {
    return '+00:00';
    // ili
    // return 'Z';
  }
  const timezoneSign = timezoneOffset > 0 ? '-' : '+';
  const timezoneHoursPadded = Math.abs(Math.floor(timezoneOffset / 60))
    .toString()
    .padStart(2, '0');
  const timezoneMinutesPadded = (timezoneOffset % 60)
    .toString()
    .padStart(2, '0');
  return `${timezoneSign}${timezoneHoursPadded}:${timezoneMinutesPadded}`;
}

const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function getDateString(year: number, month: number, dayOfMonth: number) {
  const yearPadded = year.toString().padStart(4, '0');
  const monthPadded = month.toString().padStart(2, '0');
  const datePadded = dayOfMonth.toString().padStart(2, '0');
  return `${yearPadded}-${monthPadded}-${datePadded}`;
}

export function getStartOfDayDate(date: DateObject) {
  const timezoneString = getTimezoneString(date.timezoneOffset);
  const dateString = getDateString(date.year, date.month, date.dayOfMonth);
  const startOfDayDateString = `${dateString}T${'00'}:${'00'}:${'00'}.${'000'}${timezoneString}`;
  return new Date(startOfDayDateString);
}

export function getEndOfDayDate(date: DateObject) {
  const timezoneString = getTimezoneString(date.timezoneOffset);
  const dateString = getDateString(date.year, date.month, date.dayOfMonth);
  const endOfDayDateString = `${dateString}T${'23'}:${'59'}:${'59'}.${'999'}${timezoneString}`;
  return new Date(endOfDayDateString);
}

export function getStartOfWeek(date: DateObject) {
  const startOfDay = getStartOfDayDate(date);
  let dayOfWeek = date.dayOfWeek;
  if (dayOfWeek === 0) {
    dayOfWeek = 7;
  }
  const currentDate = new Date(startOfDay);
  currentDate.setDate(currentDate.getDate() - dayOfWeek + 1);
  return currentDate;
}

export function getEndOfWeek(date: DateObject) {
  const endOfDayDate = getEndOfDayDate(date);
  let dayOfWeek = date.dayOfWeek;
  if (dayOfWeek === 0) {
    dayOfWeek = 7;
  }
  const currentDate = new Date(endOfDayDate);
  currentDate.setDate(currentDate.getDate() + (7 - dayOfWeek));
  return currentDate;
}

function isLeapYear(year: number) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

export function getDaysInMonth(month: number, year: number) {
  if (isLeapYear(year) && month === 2) {
    return 29;
  }
  return daysPerMonth[month - 1];
}

export function getStartOfMonth(date: DateObject) {
  const startOfMonth = getStartOfDayDate(date);
  startOfMonth.setDate(startOfMonth.getDate() - date.dayOfMonth + 1);
  return startOfMonth;
}

export function getEndOfMonth(date: DateObject) {
  const d = getEndOfDayDate(date);
  const daysInMonth = getDaysInMonth(date.month, date.year);
  d.setDate(d.getDate() + (daysInMonth - date.dayOfMonth));
  return d;
}

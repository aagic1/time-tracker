export class DateWithTimezone {
  private static daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  private _year: number;
  private _month: number;
  private _dayOfMonth: number;
  private _dayOfWeek: number;
  private _hours: number;
  private _minutes: number;
  private _seconds: number;
  private _miliseconds: number;
  private _timezoneOffset: number;

  constructor(timezoneOffset: number) {
    const d = new Date();
    d.setMinutes(d.getMinutes() + (d.getTimezoneOffset() - timezoneOffset));

    this._year = d.getFullYear();
    this._month = d.getMonth() + 1;
    this._dayOfMonth = d.getDate();
    this._dayOfWeek = d.getDay();
    if (this._dayOfWeek === 0) {
      this._dayOfWeek = 7;
    }
    this._hours = d.getHours();
    this._minutes = d.getMinutes();
    this._seconds = d.getSeconds();
    this._miliseconds = d.getMilliseconds();
    this._timezoneOffset = timezoneOffset;
  }

  public getStartOf(timespan: 'day' | 'week' | 'month') {
    if (timespan === 'day') {
      return this.getStartOfDay();
    } else if (timespan === 'week') {
      return this.getStartOfWeek();
    } else if (timespan === 'month') {
      return this.getStartOfMonth();
    } else {
      return this.getStartOfYear();
    }
  }

  public getEndOf(timespan: 'day' | 'week' | 'month') {
    if (timespan === 'day') {
      return this.getEndOfDay();
    } else if (timespan === 'week') {
      return this.getEndOfWeek();
    } else if (timespan === 'month') {
      return this.getEndOfMonth();
    } else {
      return this.getEndOfYear();
    }
  }

  public getStartOfDay() {
    const startOfDayDateString = `${this.getDateString()}T00:00:00.000${this.getTimezoneString()}`;
    return new Date(startOfDayDateString);
  }

  public getEndOfDay() {
    const endOfDay = this.getStartOfDay();
    endOfDay.setDate(endOfDay.getDate() + 1);
    return endOfDay;
  }

  public getStartOfWeek() {
    const d = new Date(this.year, this.month - 1, this.dayOfMonth);
    d.setDate(d.getDate() + (1 - this.dayOfWeek));
    const dateString = DateWithTimezone.getDateString(
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate()
    );
    return new Date(`${dateString}T00:00:00.000${this.getTimezoneString()}`);
  }

  public getEndOfWeek() {
    const endOfWeek = this.getStartOfWeek();
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    return endOfWeek;
  }

  public getStartOfMonth() {
    const dateString = DateWithTimezone.getDateString(this.year, this.month, 1);
    return new Date(`${dateString}T00:00:00.000${this.getTimezoneString()}`);
  }

  public getEndOfMonth() {
    const endOfMonth = this.getStartOfMonth();
    endOfMonth.setDate(endOfMonth.getDate() + this.getDaysInMonth());
    return endOfMonth;
  }

  public getStartOfYear() {
    const dateString = DateWithTimezone.getDateString(this.year, 1, 1);
    return new Date(`${dateString}T00:00:00.000${this.getTimezoneString()}`);
  }

  public getEndOfYear() {
    const dateString = DateWithTimezone.getDateString(this.year + 1, 1, 1);
    return new Date(`${dateString}T00:00:00.000${this.getTimezoneString()}`);
  }

  public get year() {
    return this._year;
  }

  public get month() {
    return this._month;
  }

  public get dayOfWeek() {
    return this._dayOfWeek;
  }

  public get dayOfMonth() {
    return this._dayOfMonth;
  }

  public get hours() {
    return this._hours;
  }

  public get minutes() {
    return this._minutes;
  }

  public get seconds() {
    return this._seconds;
  }

  public get miliseconds() {
    return this._miliseconds;
  }

  public get timezoneOffset() {
    return this._timezoneOffset;
  }

  public toUTCString() {
    return `${this.getDateString()}T${this.getTimeString()}${this.getTimezoneString()}`;
  }

  public toDate() {
    return new Date(this.toUTCString());
  }

  private isLeapYear() {
    return (this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0;
  }

  private getDaysInMonth() {
    if (this.isLeapYear() && this.month === 2) {
      return 29;
    }
    return DateWithTimezone.daysPerMonth[this.month - 1];
  }

  private isValidDate(year: number, month: number, dayOfMonth: number) {
    if (year < 100) {
      throw 'Please enter a year greater than or equal to 100';
    }
    const maxDaysInMonth = DateWithTimezone.getDaysInMonth(month, year);
    return dayOfMonth >= 1 && dayOfMonth <= maxDaysInMonth && month >= 1 && month <= 12;
  }

  private isValidTime(h: number, m: number, s: number, ms: number) {
    return h >= 0 && h < 24 && m >= 0 && m < 60 && s >= 0 && s < 60 && ms >= 0 && ms < 1000;
  }

  private getTimezoneString() {
    if (this._timezoneOffset === 0) {
      return '+00:00';
      // ili return 'Z';
    }
    const timezoneSign = this._timezoneOffset > 0 ? '-' : '+';
    const timezoneHoursPadded = Math.abs(Math.floor(this._timezoneOffset / 60))
      .toString()
      .padStart(2, '0');
    const timezoneMinutesPadded = Math.abs(Math.floor(this._timezoneOffset % 60))
      .toString()
      .padStart(2, '0');
    return `${timezoneSign}${timezoneHoursPadded}:${timezoneMinutesPadded}`;
  }

  private getDateString() {
    const yearPadded = this._year.toString().padStart(4, '0');
    const monthPadded = this._month.toString().padStart(2, '0');
    const datePadded = this._dayOfMonth.toString().padStart(2, '0');
    return `${yearPadded}-${monthPadded}-${datePadded}`;
  }

  private getTimeString() {
    const hoursPadded = this._hours.toString().padStart(2, '0');
    const minutesPadded = this._minutes.toString().padStart(2, '0');
    const secondsPadded = this._seconds.toString().padStart(2, '0');
    return `${hoursPadded}:${minutesPadded}:${secondsPadded}.${this._miliseconds}`;
  }

  // STATIC METHODS
  private static isLeapYear(year: number) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }

  private static getDaysInMonth(month: number, year: number) {
    if (DateWithTimezone.isLeapYear(year) && month === 2) {
      return 29;
    }
    return DateWithTimezone.daysPerMonth[month - 1];
  }
  private static getDateString(year: number, month: number, dayOfMonth: number) {
    const yearPadded = year.toString().padStart(4, '0');
    const monthPadded = month.toString().padStart(2, '0');
    const datePadded = dayOfMonth.toString().padStart(2, '0');
    return `${yearPadded}-${monthPadded}-${datePadded}`;
  }
}

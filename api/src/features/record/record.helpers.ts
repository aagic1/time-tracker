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

  //   constructor(timezoneOffset: number);
  //   constructor(
  //     year: number,
  //     month: number,
  //     dayOfMonth: number,
  //     timezoneOffset: number,
  //     hours?: number,
  //     minutes?: number,
  //     seconds?: number,
  //     miliseconds?: number
  //   );
  //   constructor(
  //     yearOrTimezoneOffset: number,
  //     month?: number,
  //     dayOfMonth?: number,
  //     timezoneOffset?: number,
  //     hours?: number,
  //     minutes?: number,
  //     seconds?: number,
  //     miliseconds?: number
  //   ) {
  //     // if (!this.isValidDate(year, month, dayOfMonth)) {
  //     //   throw 'Invalid d with timezone';
  //     // }
  //     // if (
  //     //   !this.isValidTime(
  //     //     hours || 0,
  //     //     minutes || 0,
  //     //     seconds || 0,
  //     //     miliseconds || 0
  //     //   )
  //     // ) {
  //     //   throw 'Invalid time';
  //     // }

  //     this._year = yearOrTimezoneOffset;
  //     this._month = month;
  //     this._dayOfMonth = dayOfMonth;
  //     this._dayOfWeek = new Date(year, month - 1, dayOfMonth).getDay();
  //     if (this._dayOfWeek === 0) {
  //       this._dayOfWeek = 7;
  //     }
  //     this._hours = hours || 0;
  //     this._minutes = minutes || 0;
  //     this._seconds = seconds || 0;
  //     this._miliseconds = miliseconds || 0;
  //     this._timezoneOffset = timezoneOffset || 0;
  //   }

  // constructor(dateString: string, timezoneOffset: number) {
  //   const [year, month, dayOfMonth] = dateString
  //     .split('-')
  //     .map((val) => Number.parseInt(val));

  //   if (!this.isValidDate(year, month, dayOfMonth)) {
  //     throw 'Invalid d with timezone';
  //   }

  //   this._year = year;
  //   this._month = month;
  //   this._dayOfMonth = dayOfMonth;
  //   this._dayOfWeek = new Date(year, month - 1, dayOfMonth).getDay();
  //   if (this._dayOfWeek === 0) {
  //     this._dayOfWeek = 7;
  //   }
  //   this._timezoneOffset = timezoneOffset;
  // }

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
    const endOfDayDateString = `${this.getDateString()}T23:59:59.999${this.getTimezoneString()}`;
    return new Date(endOfDayDateString);
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
    const d = new Date(this.year, this.month - 1, this.dayOfMonth);
    d.setDate(d.getDate() + (7 - this.dayOfWeek));
    const dateString = DateWithTimezone.getDateString(
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate()
    );
    return new Date(`${dateString}T23:59:59.999${this.getTimezoneString()}`);
  }

  public getStartOfMonth() {
    const dateString = DateWithTimezone.getDateString(this.year, this.month, 1);
    return new Date(`${dateString}T00:00:00.000${this.getTimezoneString()}`);
  }

  public getEndOfMonth() {
    const dateString = DateWithTimezone.getDateString(this.year, this.month, this.getDaysInMonth());
    return new Date(`${dateString}T23:59:59.999${this.getTimezoneString()}`);
  }

  public getStartOfYear() {
    const dateString = DateWithTimezone.getDateString(this.year, 1, 1);
    return new Date(`${dateString}T00:00:00.000${this.getTimezoneString()}`);
  }

  public getEndOfYear() {
    const dateString = DateWithTimezone.getDateString(this.year, 12, 31);
    return new Date(`${dateString}T23:59:59.999${this.getTimezoneString()}`);
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
    let s = `${this.getDateString()}T${this.getTimeString()}${this.getTimezoneString()}`;
    return `${this.getDateString()}T${this.getTimeString()}${this.getTimezoneString()}`;
  }

  public toDate() {
    return new Date(this.toUTCString());
  }

  private static isLeapYear(year: number) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }

  private static getDaysInMonth(month: number, year: number) {
    if (DateWithTimezone.isLeapYear(year) && month === 2) {
      return 29;
    }
    return DateWithTimezone.daysPerMonth[month - 1];
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

  private static getDateString(year: number, month: number, dayOfMonth: number) {
    const yearPadded = year.toString().padStart(4, '0');
    const monthPadded = month.toString().padStart(2, '0');
    const datePadded = dayOfMonth.toString().padStart(2, '0');
    return `${yearPadded}-${monthPadded}-${datePadded}`;
  }

  private getTimeString() {
    const hoursPadded = this._hours.toString().padStart(2, '0');
    const minutesPadded = this._minutes.toString().padStart(2, '0');
    const secondsPadded = this._seconds.toString().padStart(2, '0');
    return `${hoursPadded}:${minutesPadded}:${secondsPadded}.${this._miliseconds}`;
  }
}

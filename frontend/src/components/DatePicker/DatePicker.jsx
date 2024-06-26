import DatePicker3rdParty from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import styles from './date-picker.module.css';

export function DatePicker({
  selected,
  onChange,
  className = '',
  showTimeInput,
  wrapperClassName,
  maxDate,
  minTime,
  maxTime,
  format = 'dd.MM.yyyy',

  showWeekPicker,
  showMonthPicker,
  showYearPicker,
}) {
  return (
    <DatePicker3rdParty
      className={`${styles.datePicker} ${className}`}
      dateFormat={format}
      calendarStartDay={1}
      showIcon
      selected={selected}
      onChange={onChange}
      yearDropdownItemNumber={50}
      showYearDropdown
      scrollableYearDropdown={true}
      showMonthDropdown
      todayButton="Today"
      showTimeInput={showTimeInput}
      wrapperClassName={wrapperClassName}
      timeFormat="HH:mm"
      maxDate={maxDate}
      minTime={minTime}
      maxTime={maxTime}
      popperClassName={styles.datePopper}
      popperPlacement="bottom-start"
      showWeekNumbers={showWeekPicker}
      showWeekPicker={showWeekPicker}
      showMonthYearPicker={showMonthPicker}
      showYearPicker={showYearPicker}
    />
  );
}

import DatePicker3rdParty from 'react-datepicker';

import styles from './date-picker.module.css';

export function DatePicker({ selected, onChange, className = '' }) {
  return (
    <DatePicker3rdParty
      className={`${styles.datePicker} ${className}`}
      dateFormat="dd.MM.yyyy"
      calendarStartDay={1}
      showIcon
      selected={selected}
      onChange={onChange}
      yearDropdownItemNumber={50}
      showYearDropdown
      scrollableYearDropdown={true}
      showMonthDropdown
      todayButton="Today"
    />
  );
}

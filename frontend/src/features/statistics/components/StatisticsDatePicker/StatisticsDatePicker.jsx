import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SelectPeriod } from '../SelectPeriod';
import { DatePicker } from '../../../../components/DatePicker';
import styles from './statistics-date-picker.module.css';

const dateFormat = {
  day: 'dd.MM.yyyy',
  week: 'dd.MM.yyyy (w)',
  month: 'MMMM yyyy',
  year: 'yyyy',
};

export function StatisticsDatePicker({
  dateStats,
  period,
  onPreviousDate,
  onNextDate,
  onChangeDate,
  onChangePeriod,
}) {
  return (
    <div className={styles.dateContainer}>
      <SelectPeriod selected={period} onChange={onChangePeriod} />
      <FaChevronLeft className={styles.arrow} onClick={onPreviousDate} />
      <DatePicker
        onChange={onChangeDate}
        selected={dateStats}
        showWeekPicker={period === 'week'}
        showMonthPicker={period === 'month'}
        showYearPicker={period === 'year'}
        format={dateFormat[period]}
      />
      <FaChevronRight className={styles.arrow} onClick={onNextDate} />
    </div>
  );
}

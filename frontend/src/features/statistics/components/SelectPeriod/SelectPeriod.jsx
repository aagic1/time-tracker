import styles from './select-period.module.css';

const periodOptions = [
  { id: 1, value: 'day', name: 'Day' },
  { id: 2, value: 'week', name: 'Week' },
  { id: 3, value: 'month', name: 'Month' },
  { id: 4, value: 'year', name: 'Year' },
];

export function SelectPeriod({ selected, onChange }) {
  return (
    <select
      name="type"
      id="type"
      className={styles.selectInput}
      value={selected}
      onChange={onChange}
    >
      {periodOptions.map((entry) => (
        <option key={entry.id} value={entry.value}>
          {entry.name}
        </option>
      ))}
    </select>
  );
}

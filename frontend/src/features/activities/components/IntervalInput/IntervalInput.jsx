import styles from './interval-input.module.css';

export function IntervalInput({ type, value, onChange }) {
  const goal = value != null ? value : { hours: 0, minutes: 0, seconds: 0 };

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          className={`${styles.numberInput} ${styles.numberInputHours}`}
          type="number"
          name={`hours-${type}`}
          id={`hours-${type}`}
          min={0}
          max={99999}
          value={goal.hours.toString()}
          onChange={(e) => onChange(e, type)}
        />
        <label className={styles.goalLabel} htmlFor={`hours-${type}`}>
          h
        </label>
      </div>
      <div className={styles.inputContainer}>
        <input
          className={styles.numberInput}
          type="number"
          name={`minutes-${type}`}
          id={`minutes-${type}`}
          min={0}
          max={59}
          value={goal.minutes.toString()}
          onChange={(e) => onChange(e, type)}
        />
        <label className={styles.goalLabel} htmlFor={`minutes-${type}`}>
          m
        </label>
      </div>
      <div className={styles.inputContainer}>
        <input
          className={styles.numberInput}
          type="number"
          name={`seconds-${type}`}
          id={`seconds-${type}`}
          min={0}
          max={59}
          value={goal.seconds.toString()}
          onChange={(e) => onChange(e, type)}
        />
        <label className={styles.goalLabel} htmlFor={`seconds-${type}`}>
          s
        </label>
      </div>
    </div>
  );
}

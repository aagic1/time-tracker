import styles from './goal-picker.module.css';

export default function GoalPicker({ type, value, onChange }) {
  const goal = value != null ? value : { hours: 0, minutes: 0, seconds: 0 };

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          dir="rtl"
          className={`${styles.numberInput} ${styles.numberInputHours}`}
          type="number"
          name="hours"
          id="hours"
          min={0}
          value={goal.hours}
          onChange={(e) => onChange(e, type)}
        />
        <label className={styles.goalLabel} htmlFor="hours">
          h
        </label>
      </div>
      <div className={styles.inputContainer}>
        <input
          dir="rtl"
          className={styles.numberInput}
          type="number"
          name="minutes"
          id="minutes"
          min={0}
          max={59}
          value={goal.minutes}
          onChange={(e) => onChange(e, type)}
        />
        <label className={styles.goalLabel} htmlFor="minutes">
          m
        </label>
      </div>
      <div className={styles.inputContainer}>
        <input
          dir="rtl"
          className={styles.numberInput}
          type="number"
          name="seconds"
          id="seconds"
          min={0}
          max={59}
          value={goal.seconds}
          onChange={(e) => onChange(e, type)}
        />
        <label className={styles.goalLabel} htmlFor="seconds">
          s
        </label>
      </div>
    </div>
  );
}

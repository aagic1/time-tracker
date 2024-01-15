import styles from './goal-input.module.css';
import IntervalInput from '../IntervalInput/IntervalInput';

export default function GoalInput({
  goal,
  isChecked,
  handleCheck,
  handleIntervalChange,
}) {
  console.log('goal');
  console.log(goal);
  return (
    <div className={styles.goalInputContainer}>
      <div className={styles.goalCheckContainer}>
        <input
          checked={isChecked}
          onChange={handleCheck}
          type="checkbox"
          name={goal.type}
          id={goal.type}
        />
        <label className={styles.checkLabel} htmlFor={goal.type}>
          {goal.name}
        </label>
      </div>
      <div
        className={`${styles.goalPickerContainer} ${
          !isChecked ? styles.hidden : ''
        }`}
      >
        <IntervalInput
          value={goal.interval}
          onChange={handleIntervalChange}
          type={goal.type}
        />
      </div>
    </div>
  );
}

import styles from './goal-input.module.css';
import { IntervalInput } from '../IntervalInput';

export function GoalInput({ goal, isChecked, handleCheck, handleIntervalChange }) {
  return (
    <div className={styles.goalInputContainer}>
      <div className={styles.goalCheckContainer}>
        <input
          checked={isChecked}
          onChange={handleCheck}
          type="checkbox"
          name={`check-${goal.type}`}
          id={`check-${goal.type}`}
        />
        <label className={styles.checkLabel} htmlFor={`check-${goal.type}`}>
          {goal.name}
        </label>
      </div>
      <div className={`${styles.goalPickerContainer} ${!isChecked ? styles.hidden : ''}`}>
        <IntervalInput value={goal.interval} onChange={handleIntervalChange} type={goal.type} />
      </div>
    </div>
  );
}

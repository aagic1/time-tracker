import styles from './activity-picker.module.css';

export function ActivityPicker({ activities, selectedActivity, onChange, onBlur, id }) {
  let showPlaceholder = false;
  if (!activities.some((activity) => activity.id === selectedActivity?.id)) {
    showPlaceholder = true;
  }
  const selectedValue = showPlaceholder ? 'placeholder' : selectedActivity.id;

  return (
    <div className={styles.activityContainer}>
      <label htmlFor="activity">Activity</label>
      <select
        value={selectedValue}
        className={styles.dropdown}
        name="activityId"
        id={id}
        onChange={onChange}
        onBlur={onBlur}
      >
        <option disabled value="placeholder">
          Choose activity
        </option>
        {activities
          .toSorted((a, b) => a.name.localeCompare(b.name))
          .map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.name}
            </option>
          ))}
      </select>
    </div>
  );
}

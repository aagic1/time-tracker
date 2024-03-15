import { useLoaderData, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useImmer } from 'use-immer';
import toast from 'react-hot-toast';

import styles from './activity-editor.module.css';
import { ActivityPreview } from '../../components/ActivityPreview';
import { GoalInput } from '../../components/GoalInput';
import { createActivity, getactivity, updateActivity } from '../../api';
import { randomLightColor } from '../../utils/randomLightColor.js';

export function ActivityEditor() {
  const { type, activity } = useLoaderData();
  const navigate = useNavigate();

  const [name, setName] = useState(type === 'create' ? '' : activity.name);
  const [color, setColor] = useState(type === 'create' ? randomLightColor() : activity.color);
  const [goalData, updateGoalData] = useImmer({
    sessionGoal: activity?.sessionGoal,
    dayGoal: activity?.dayGoal,
    weekGoal: activity?.weekGoal,
    monthGoal: activity?.monthGoal,
  });
  const [checkedGoals, updateCheckedGoals] = useImmer({
    sessionGoal: activity?.sessionGoal != null,
    dayGoal: activity?.dayGoal != null,
    weekGoal: activity?.weekGoal != null,
    monthGoal: activity?.monthGoal != null,
  });

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <ActivityPreview name={name} color={color} className={styles.preview} />
        <form
          method={type === 'create' ? 'POST' : 'PATCH'}
          className={styles.activityForm}
          onSubmit={handleSubmit}
        >
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="name">
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="color">
              Color:
            </label>
            <input
              type="color"
              name="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className={styles.goalsContainer}>
            Goals
            <GoalInput
              isChecked={checkedGoals.sessionGoal}
              handleCheck={handleCheck}
              handleIntervalChange={handleChange}
              goal={{
                type: 'sessionGoal',
                name: 'Session goal',
                interval: goalData.sessionGoal,
              }}
            />
            <GoalInput
              isChecked={checkedGoals.dayGoal}
              handleCheck={handleCheck}
              handleIntervalChange={handleChange}
              goal={{
                type: 'dayGoal',
                name: 'Day goal',
                interval: goalData.dayGoal,
              }}
            />
            <GoalInput
              isChecked={checkedGoals.weekGoal}
              handleCheck={handleCheck}
              handleIntervalChange={handleChange}
              goal={{
                type: 'weekGoal',
                name: 'Week goal',
                interval: goalData.weekGoal,
              }}
            />
            <GoalInput
              isChecked={checkedGoals.monthGoal}
              handleCheck={handleCheck}
              handleIntervalChange={handleChange}
              goal={{
                type: 'monthGoal',
                name: 'Month goal',
                interval: goalData.monthGoal,
              }}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.formButton}>Save</button>
            <button
              className={styles.formButton}
              type="button"
              onClick={() => navigate('..', { relative: 'path' })}
            >
              Cancel
            </button>
            {type !== 'create' && (
              <button
                type="button"
                onClick={handleArchive}
                className={`${styles.archiveButton} ${styles.formButton}`}
              >
                Archive
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  function handleCheck(event) {
    const name = event.target.name.split('-')[1];
    const isChecked = event.target.checked;
    updateGoalData((draft) => {
      draft[name] = isChecked ? { hours: 0, minutes: 0, seconds: 0 } : null;
    });
    updateCheckedGoals((draft) => {
      draft[name] = isChecked;
    });
  }

  function handleChange(event, goalType) {
    const timeUnit = event.target.name.split('-')[0];
    // const timeValue = event.target.value;
    let timeValueString = event.target.value;
    // remove leading zeros
    while (timeValueString[0] === '0' && timeValueString.length > 1) {
      timeValueString = timeValueString.split('').slice(1).join('');
    }
    let timeValue = Number.parseInt(timeValueString);
    if (Number.isNaN(timeValue)) {
      timeValue = 0;
    }
    if (timeValue > event.target.max) {
      timeValue = event.target.max;
    }
    if (timeValue < event.target.min) {
      timeValue = event.target.min;
    }

    updateGoalData((draft) => {
      draft[goalType][timeUnit] = Number(timeValue);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const body = {
      name: name,
      color: color,
      sessionGoal: goalData.sessionGoal,
      dayGoal: goalData.dayGoal,
      weekGoal: goalData.weekGoal,
      monthGoal: goalData.monthGoal,
    };
    if (type === 'create') {
      const { response } = await createActivity(body);
      if (!response.ok) {
        return toast.error('Failed to create activity', { id: 'create-activity-error' });
      }
    } else {
      const { response } = await updateActivity(activity.name, body);
      if (!response.ok) {
        return toast.error('Failed to update activity', { id: 'update-activity-error' });
      }
    }

    navigate('..', { relative: 'path' });
  }

  async function handleArchive() {
    const body = {
      archived: !activity.archived,
    };
    const { response } = await updateActivity(activity.name, body);

    if (!response.ok) {
      return toast.error('Failed to update activity', { id: 'update-activity-archived-error' });
    }
    navigate('..', { relative: 'path' });
  }
}

export async function activityEditorCreateLoader() {
  return { type: 'create', activity: null };
}

export async function activityEditorUpdateLoader({ params }) {
  const activityName = params.activityName;
  const { response, data: activity } = await getactivity(activityName);
  if (!response.ok) {
    return toast.error(`Activity with name ${activityName} not found.`);
  }
  return { type: 'edit', activity };
}

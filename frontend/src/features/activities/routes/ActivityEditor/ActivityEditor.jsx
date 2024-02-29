import { useLoaderData, useNavigate } from 'react-router-dom';
import styles from './activity-editor.module.css';
import { useState } from 'react';
import { useImmer } from 'use-immer';
import ActivityPreview from '../../components/ActivityPreview/ActivityPreview.jsx';
import GoalInput from '../../components/GoalInput/GoalInput.jsx';

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const lastSegment = pathname.split('/').slice(-1)[0];
  if (lastSegment === 'create') {
    return { type: 'create', activity: null };
  } else {
    const activityName = params.activityName;
    const res = await fetch(`http://localhost:8000/api/v1/activities/${activityName}`, {
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('Activity editor: Failed to fetch activity with id ' + activityName);
    }
    const { activity } = await res.json();
    return { type: 'edit', activity };
  }
}

export default function ActivityEditor() {
  const { type, activity } = useLoaderData();
  const navigate = useNavigate();
  4;

  const [name, setName] = useState(type === 'create' ? '' : activity.name);
  const [color, setColor] = useState(type === 'create' ? '#888888' : activity.color);
  const [goalData, updateGoalData] = useImmer({
    sessionGoal: type === 'create' ? null : activity.sessionGoal,
    dayGoal: type === 'create' ? null : activity.dayGoal,
    weekGoal: type === 'create' ? null : activity.weekGoal,
    monthGoal: type === 'create' ? null : activity.monthGoal,
  });
  const [checkedGoals, updateCheckedGoals] = useImmer({
    sessionGoal: type === 'create' ? false : activity.sessionGoal != null,
    dayGoal: type === 'create' ? false : activity.dayGoal != null,
    weekGoal: type === 'create' ? false : activity.weekGoal != null,
    monthGoal: type === 'create' ? false : activity.monthGoal != null,
  });

  function handleCheck(event) {
    const name = event.target.name;
    const isChecked = event.target.checked;
    updateGoalData((draft) => {
      draft[name] = isChecked ? { hours: 0, minutes: 0, seconds: 0 } : null;
    });
    updateCheckedGoals((draft) => {
      draft[name] = isChecked;
    });
  }

  function handleChange(event, goalType) {
    const timeUnit = event.target.name;
    const timeValue = event.target.value;
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
    let res;
    if (type === 'create') {
      res = await fetch('http://localhost:8000/api/v1/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
    } else {
      res = await fetch(`http://localhost:8000/api/v1/activities/${activity.name}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
    }
    if (!res.ok) {
      throw new Error(`Failed to ${type === 'create' ? 'create' : 'update'} activity`);
    }
    // const data = await res.json();
    navigate('..');
  }

  async function handleArchive() {
    const body = {
      archived: !activity.archived,
    };
    const res = await fetch(`http://localhost:8000/api/v1/activities/${activity.name}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed to archive activity`);
    }
    navigate('..');
  }

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
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="name">Color:</label>
            <input
              type="color"
              name="name"
              id="name"
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
            <button>Save</button>
            <button type="button" onClick={() => navigate('..')}>
              Cancel
            </button>
            {type !== 'create' && (
              <button type="button" onClick={handleArchive} className={styles.archiveButton}>
                Archive
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

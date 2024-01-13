import { Form, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import styles from './activity-editor.module.css';
import { useState } from 'react';
import { useImmer } from 'use-immer';
import ActivityPreview from '../../components/ActivityPreview/ActivityPreview.jsx';
import GoalPicker from '../../components/GoalPicker/GoalPicker.jsx';

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const lastSegment = pathname.split('/').slice(-1)[0];
  if (lastSegment === 'create') {
    return { type: 'create', data: { activity: null } };
  } else {
    const activityName = params.activityName;
    const res = await fetch(
      `http://localhost:8000/api/v1/activities/${activityName}`,
      {
        credentials: 'include',
      }
    );
    if (!res.ok) {
      // throw new Error('Failed to fetch activity with id ' + activityName);
      console.log('hi');
    }
    const { activity } = await res.json();
    if (activity.sessionGoal) {
      if (activity.sessionGoal.hours == null) {
        activity.sessionGoal.hours = 0;
      }
      if (activity.sessionGoal.minutes == null) {
        activity.sessionGoal.minutes = 0;
      }
      if (activity.sessionGoal.seconds == null) {
        activity.sessionGoal.seconds = 0;
      }
    }
    if (activity.dayGoal) {
      if (activity.dayGoal.hours == null) {
        activity.dayGoal.hours = 0;
      }
      if (activity.dayGoal.minutes == null) {
        activity.dayGoal.minutes = 0;
      }
      if (activity.dayGoal.seconds == null) {
        activity.dayGoal.seconds = 0;
      }
    }
    if (activity.weekGoal) {
      if (activity.weekGoal.hours == null) {
        activity.weekGoal.hours = 0;
      }
      if (activity.weekGoal.minutes == null) {
        activity.weekGoal.minutes = 0;
      }
      if (activity.weekGoal.seconds == null) {
        activity.weekGoal.seconds = 0;
      }
    }
    if (activity.monthGoal) {
      if (activity.monthGoal.hours == null) {
        activity.monthGoal.hours = 0;
      }
      if (activity.monthGoal.minutes == null) {
        activity.monthGoal.minutes = 0;
      }
      if (activity.monthGoal.seconds == null) {
        activity.monthGoal.seconds = 0;
      }
    }
    return { type: 'edit', data: { activity } };
  }
}

export default function ActivityEditor() {
  const {
    type,
    data: { activity },
  } = useLoaderData();
  const navigate = useNavigate();

  const [name, setName] = useState(type === 'create' ? '' : activity.name);
  const [color, setColor] = useState(
    type === 'create' ? '#888888' : activity.color
  );
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
      draft[goalType + 'Goal'][timeUnit] = Number(timeValue);
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
    console.log(body);
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
      res = await fetch(
        `http://localhost:8000/api/v1/activities/${activity.name}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(body),
        }
      );
    }
    if (!res.ok) {
      throw new Error(
        `Failed to ${type === 'create' ? 'create' : 'update'} activity`
      );
    }
    const data = await res.json();
    navigate('..');
  }

  async function handleDelete() {
    const res = await fetch(
      `http://localhost:8000/api/v1/activities/${activity.name}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
    if (!res.ok) {
      throw new Error('Failed to delete activity with name ' + activity.name);
    }
    navigate('..');
  }

  async function handleArchive() {
    const body = {
      archived: !activity.archived,
    };
    const res = await fetch(
      `http://localhost:8000/api/v1/activities/${activity.name}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to archive activity`);
    }
    navigate('..');
  }

  if (activity && activity.archived) {
    return (
      <>
        <ActivityPreview name={name} color={color} className={styles.preview} />
        {/* <div
          className={styles.editArchivedHeader}
          style={{ backgroundColor: activity.color }}
        >
          {activity.name}
        </div> */}
        <button
          type="button"
          onClick={handleArchive}
          className={styles.archiveButton}
        >
          {activity.archived ? 'Restore' : 'Archive'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className={styles.deleteButton}
        >
          Delete
        </button>
        <button type="button" onClick={() => navigate('..')}>
          Cancel
        </button>
      </>
    );
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
            <div className={styles.goalInputContainer}>
              <div className={styles.goalCheckContainer}>
                <input
                  checked={checkedGoals.sessionGoal}
                  onChange={handleCheck}
                  type="checkbox"
                  name="sessionGoal"
                  id="sessionGoal"
                />
                <label className={styles.checkLabel} htmlFor="sessionGoal">
                  Session goal
                </label>
              </div>
              {checkedGoals.sessionGoal && (
                <div className={styles.goalPickerContainer}>
                  <GoalPicker
                    value={goalData.sessionGoal}
                    onChange={handleChange}
                    type="session"
                  />
                </div>
              )}
            </div>
            <div className={styles.goalInputContainer}>
              <div className={styles.goalCheckContainer}>
                <input
                  checked={checkedGoals.dayGoal}
                  onChange={handleCheck}
                  type="checkbox"
                  name="dayGoal"
                  id="dayGoal"
                />
                <label className={styles.checkLabel} htmlFor="dayGoal">
                  Day goal
                </label>
              </div>
              {checkedGoals.dayGoal && (
                <div className={styles.goalPickerContainer}>
                  <GoalPicker
                    value={goalData.dayGoal}
                    onChange={handleChange}
                    type="day"
                  />
                </div>
              )}
            </div>
            <div className={styles.goalInputContainer}>
              <div className={styles.goalCheckContainer}>
                <input
                  checked={checkedGoals.weekGoal}
                  onChange={handleCheck}
                  type="checkbox"
                  name="weekGoal"
                  id="weekGoal"
                />
                <label className={styles.checkLabel} htmlFor="weekGoal">
                  Week goal
                </label>
              </div>
              {checkedGoals.weekGoal && (
                <div className={styles.goalPickerContainer}>
                  <GoalPicker
                    value={goalData.weekGoal}
                    onChange={handleChange}
                    type="week"
                  />
                </div>
              )}
            </div>
            <div className={styles.goalInputContainer}>
              <div className={styles.goalCheckContainer}>
                <input
                  checked={checkedGoals.monthGoal}
                  onChange={handleCheck}
                  type="checkbox"
                  name="monthGoal"
                  id="monthGoal"
                />
                <label className={styles.checkLabel} htmlFor="monthGoal">
                  Month goal
                </label>
              </div>
              {checkedGoals.monthGoal && (
                <div className={styles.goalPickerContainer}>
                  <GoalPicker
                    value={goalData.monthGoal}
                    onChange={handleChange}
                    type="month"
                  />
                </div>
              )}
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button>Save</button>
            <button type="button" onClick={() => navigate('..')}>
              Cancel
            </button>
            {type !== 'create' && (
              <>
                {/* <div className={styles.separator}></div> */}
                <button
                  type="button"
                  onClick={handleArchive}
                  className={styles.archiveButton}
                >
                  {activity.archived ? 'Restore' : 'Archive'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

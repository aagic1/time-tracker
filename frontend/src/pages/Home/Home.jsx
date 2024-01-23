import { useReducer } from 'react';
import { useImmerReducer } from 'use-immer';
import { useLoaderData, useNavigation } from 'react-router-dom';

import styles from './home.module.css';
import ActivityCard from '../../components/ActivityCard/ActivityCard';
import CreateActivityCard from '../../components/CreateActivityCard/CreateActivityCard';
import ArchivedActivityCard from '../../components/ArchivedActivityCard/ArchivedActivityCard';
import ActiveRecord from '../../components/ActiveRecord/ActiveRecord';
import HorizontalSeparator from '../../components/HorizontalSeparator/HorizontalSeparator';

export async function loader() {
  const promiseActivities = fetch('http://localhost:8000/api/v1/activities', {
    method: 'GET',
    credentials: 'include',
  });
  const promiseActiveRecords = fetch(
    'http://localhost:8000/api/v1/records?active=true',
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  const [responseActivities, responseActiveRecords] = await Promise.all([
    promiseActivities,
    promiseActiveRecords,
  ]);

  // moze se desiti da su oba errora - treba bolje obraditi - nebitno sad
  if (!responseActivities.ok) {
    throw new Error('Get activities error');
  }
  if (!responseActiveRecords.ok) {
    throw new Error('Get active records error');
  }

  return {
    activitiesData: await responseActivities.json(),
    recordsData: await responseActiveRecords.json(),
  };
}

function activeRecordsReducer(draft, action) {
  switch (action.type) {
    case 'createFake':
      draft.push(action.fakeRecord);
      break;
    case 'deleteFake': {
      return draft.filter(
        (record) =>
          !record.recordId.includes('fake') &&
          record.activityId !== action.activityId
      );
    }
    case 'swapFakeWithReal': {
      const fake = draft.find(
        (record) =>
          record.recordId.includes('fake') &&
          record.activityId === action.activityId
      );
      fake.recordId = action.recordId;
      delete fake.fake;
      break;
    }
    case 'stopRecord': {
      return draft.filter((record) => record.recordId !== action.recordId);
    }
    case 'restoreStoppedRecord':
      draft.push(action.stoppedRecord);
      break;
  }
}

function activitesReducer(activities, action) {
  switch (action.type) {
    case 'setLoading': {
      const deepCopy = structuredClone(activities);
      return deepCopy.map((activity) =>
        activity.id === action.activityId
          ? { ...activity, loading: true }
          : activity
      );
    }
    case 'setNotLoading': {
      const deepCopy = structuredClone(activities);
      return deepCopy.map((activity) =>
        activity.id === action.activityId
          ? { ...activity, loading: false }
          : activity
      );
    }
    case 'restore': {
      const deepCopy = structuredClone(activities);
      return deepCopy.map((activity) =>
        activity.id === action.activityId
          ? { ...activity, archived: false, loading: false }
          : activity
      );
    }
    case 'delete': {
      const deepCopy = structuredClone(activities);
      return deepCopy.filter((activity) => activity.id !== action.activityId);
    }
  }
}

export default function Home() {
  const navigation = useNavigation();
  const loaderData = useLoaderData();
  const [activities, dispatchActivities] = useReducer(
    activitesReducer,
    loaderData.activitiesData.activities
  );
  const [activeRecords, dispatchRecords] = useImmerReducer(
    activeRecordsReducer,
    loaderData.recordsData.records
  );

  async function handleDelete(activity) {
    dispatchActivities({ type: 'setLoading', activityId: activity.id });

    const res = await fetch(
      `http://localhost:8000/api/v1/activities/${activity.name}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );

    if (!res.ok) {
      dispatchActivities({ type: 'setNotLoading', activityId: activity.id });
      throw new Error('Failed to delete activity with name ' + activity.name);
    }

    dispatchActivities({ type: 'delete', activityId: activity.id });
  }

  async function handleRestore(activity) {
    dispatchActivities({ type: 'setLoading', activityId: activity.id });

    const res = await fetch(
      `http://localhost:8000/api/v1/activities/${activity.name}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ archived: false }),
      }
    );

    if (!res.ok) {
      dispatchActivities({ type: 'setNotLoading', activityId: activity.id });
      throw new Error(`Failed to restore activity`);
    }

    dispatchActivities({ type: 'restore', activityId: activity.id });
  }

  async function handleRecordClick(record) {
    const stoppedAt = new Date();
    dispatchRecords({ type: 'stopRecord', recordId: record.recordId });
    dispatchActivities({ type: 'setLoading', activityId: record.activityId });

    // extract fetch calls to api layer/file
    const res = await fetch(
      `http://localhost:8000/api/v1/records/${record.recordId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          stoppedAt: stoppedAt.toISOString(),
        }),
      }
    );

    dispatchActivities({
      type: 'setNotLoading',
      activityId: record.activityId,
    });

    if (!res.ok) {
      dispatchRecords({ type: 'restoreStoppedRecord', stoppedRecord: record });
      throw new Error('Failed to stop record tracking');
    }
  }

  async function handleActivityClick(activity, activeRecords) {
    const activeRecord = activeRecords.find(
      (r) => r.activityId === activity.id
    );

    if (activeRecord) {
      return handleRecordClick(activeRecord);
    }

    const fakeRecord = createFakeRecord(activity);

    dispatchActivities({ type: 'setLoading', activityId: activity.id });
    dispatchRecords({ type: 'createFake', fakeRecord });

    const res = await fetch('http://localhost:8000/api/v1/records', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activityId: activity.id,
        startedAt: fakeRecord.startedAt,
      }),
    });

    if (!res.ok) {
      dispatchActivities({ type: 'setNotLoading', activityId: activity.id });
      dispatchRecords({ type: 'deleteFake', activityId: activity.id });
      throw new Error('Failed to start record');
    }

    const newRecord = await res.json();
    dispatchRecords({
      type: 'swapFakeWithReal',
      activityId: activity.id,
      recordId: newRecord.id,
    });
    dispatchActivities({ type: 'setNotLoading', activityId: activity.id });
  }

  return (
    <div className={navigation.state === 'loading' ? styles.loading : ''}>
      {activeRecords.length > 0 && (
        <>
          <HorizontalSeparator text="Tracking" className={styles.separator} />
          <div className={styles.activeRecordsContainer}>
            <div className={styles.activeRecords}>
              {activeRecords
                .toSorted((a, b) => {
                  return new Date(b.startedAt) - new Date(a.startedAt);
                })
                .map((record) => (
                  <ActiveRecord
                    key={record.recordId}
                    record={record}
                    showEdit
                    onClick={handleRecordClick}
                    showSessionDetails
                  />
                ))}
            </div>
          </div>
        </>
      )}
      <HorizontalSeparator text="Activities" className={styles.separator} />
      <div className={styles.activitesContainer}>
        {activities
          .filter((activity) => !activity.archived)
          .map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={handleActivityClick}
              activeRecords={activeRecords}
            />
          ))}
        <CreateActivityCard />
      </div>
      {activities.some((activity) => activity.archived) && (
        <>
          <HorizontalSeparator text="Archived" className={styles.separator} />
          <div className={styles.activitesContainer}>
            {activities
              .filter((activity) => activity.archived)
              .map((activity) => (
                <ArchivedActivityCard
                  key={activity.id}
                  activity={activity}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

function createFakeRecord(activity) {
  return {
    recordId: `fake-${activity.name}`,
    startedAt: new Date().toISOString(),
    stoppedAt: null,
    activityId: activity.id,
    activityName: activity.name,
    color: activity.color.slice(1),
    sessionGoal: activity.session,
    dayGoal: activity.dayGoal,
    weekGoal: activity.weekGoal,
    monthGoal: activity.monthGoal,
    comment: null,
    fake: true,
  };
}

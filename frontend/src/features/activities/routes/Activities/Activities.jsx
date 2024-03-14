import { useReducer } from 'react';
import { useImmerReducer } from 'use-immer';
import { useLoaderData, useNavigation } from 'react-router-dom';

import styles from './activities.module.css';
import ActivityCard from '../../components/ActivityCard/ActivityCard';
import CreateActivityCard from '../../components/CreateActivityCard/CreateActivityCard';
import ArchivedActivityCard from '../../components/ArchivedActivityCard/ArchivedActivityCard';
import ActiveRecord from '../../../records/components/ActiveRecord/ActiveRecord';
import { HorizontalSeparator } from '../../../../components/HorizontalSeparator';
import { activitiesReducer } from '../../hooks/activitiesReducer';
import { activeRecordsReducer } from '../../hooks/activeRecordsReducer';
import { restoreActivity, deleteActivity, createRecord, stopRecord } from '../../api';

export function Activities() {
  const navigation = useNavigation();
  const loaderData = useLoaderData();
  const [activities, dispatchActivities] = useReducer(
    activitiesReducer,
    loaderData.activitiesData.activities
  );
  const [activeRecords, dispatchRecords] = useImmerReducer(
    activeRecordsReducer,
    loaderData.recordsData.records
  );

  async function handleDelete(activity) {
    // display activity as loading while server is processing request
    dispatchActivities({ type: 'setLoading', activityId: activity.id });

    const { response } = await deleteActivity(activity.name);
    if (!response.ok) {
      dispatchActivities({ type: 'setNotLoading', activityId: activity.id });
      throw new Error('Failed to delete activity with name ' + activity.name);
    }

    dispatchActivities({ type: 'delete', activityId: activity.id });
  }

  async function handleRestore(activity) {
    // display activity as loading while server is processing request
    dispatchActivities({ type: 'setLoading', activityId: activity.id });

    const { response } = await restoreActivity(activity.name);
    if (!response.ok) {
      dispatchActivities({ type: 'setNotLoading', activityId: activity.id });
      throw new Error(`Failed to restore activity`);
    }

    dispatchActivities({ type: 'restore', activityId: activity.id });
  }

  async function handleRecordClick(record) {
    // optimistic UI - immediately remove stopped record
    dispatchRecords({ type: 'stopRecord', recordId: record.recordId });
    dispatchActivities({ type: 'setLoading', activityId: record.activityId });

    const { response } = await stopRecord(record.recordId, new Date());

    dispatchActivities({
      type: 'setNotLoading',
      activityId: record.activityId,
    });

    // restore stopped record if server could not process request
    if (!response.ok) {
      dispatchRecords({ type: 'restoreStoppedRecord', stoppedRecord: record });
      throw new Error('Failed to stop record tracking');
    }
  }

  async function handleActivityClick(activity, activeRecords) {
    const hasActiveRecord = activeRecords.find((r) => r.activityId === activity.id);
    // clicking on an activity that is already being tracked, stops tracking the activity
    if (hasActiveRecord) {
      return handleRecordClick(hasActiveRecord);
    }

    // optimistic UI - create fake record while server is processing request
    const fakeRecord = createFakeRecord(activity);
    dispatchActivities({ type: 'setLoading', activityId: activity.id });
    dispatchRecords({ type: 'createFake', fakeRecord });

    const { response, data: newRecord } = await createRecord(activity.id, fakeRecord.startedAt);
    if (!response.ok) {
      dispatchActivities({ type: 'setNotLoading', activityId: activity.id });
      dispatchRecords({ type: 'deleteFake', activityId: activity.id });
      throw new Error('Failed to start record');
    }

    // update fake record with real values
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

export async function activitiesLoader() {
  const promiseActivities = fetch('http://localhost:8000/api/v1/activities', {
    method: 'GET',
    credentials: 'include',
  });
  const promiseActiveRecords = fetch('http://localhost:8000/api/v1/records?active=true', {
    method: 'GET',
    credentials: 'include',
  });
  const [responseActivities, responseActiveRecords] = await Promise.all([
    promiseActivities,
    promiseActiveRecords,
  ]);

  // moze se desiti da su oba errora - treba bolje obraditi
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

function createFakeRecord(activity) {
  return {
    recordId: `fake-${activity.name}`,
    startedAt: new Date().toISOString(),
    stoppedAt: null,
    activityId: activity.id,
    activityName: activity.name,
    color: activity.color.slice(1),
    sessionGoal: activity.sessionGoal,
    dayGoal: activity.dayGoal,
    weekGoal: activity.weekGoal,
    monthGoal: activity.monthGoal,
    comment: null,
    fake: true,
  };
}

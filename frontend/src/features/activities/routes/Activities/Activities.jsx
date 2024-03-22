import { useReducer } from 'react';
import { useImmerReducer } from 'use-immer';
import { useLoaderData, useNavigation } from 'react-router-dom';
import toast from 'react-hot-toast';

import styles from './activities.module.css';
import { ActivityCard } from '../../components/ActivityCard';
import { CreateActivityCard } from '../../components/CreateActivityCard';
import { ArchivedActivityCard } from '../../components/ArchivedActivityCard';
import { ActiveRecordCard } from '../../../records/components/ActiveRecordCard';
import { HorizontalSeparator } from '../../../../components/HorizontalSeparator';
import { activitiesReducer } from '../../hooks/activitiesReducer';
import { activeRecordsReducer } from '../../hooks/activeRecordsReducer';
import { restoreActivity, deleteActivity, getActivities } from '../../api';
import { createRecord, stopRecord, getRecords } from '../../../records/api';
import { FakeRecord } from '../../utils/FakeRecord';

export function Activities() {
  const navigation = useNavigation();
  const loaderData = useLoaderData();
  const [activities, dispatchActivities] = useReducer(activitiesReducer, loaderData.activities);
  const [activeRecords, dispatchRecords] = useImmerReducer(
    activeRecordsReducer,
    loaderData.activeRecords
  );
  const currentActivities = activities.filter((activity) => !activity.archived);
  const archivedActivities = activities.filter((activity) => activity.archived);

  return (
    <div className={navigation.state === 'loading' ? styles.loading : ''}>
      {activeRecords.length > 0 && (
        <>
          <HorizontalSeparator text="Tracking" className={styles.separator} />
          <div className={styles.info}>Click on card to stop tracking</div>
          <ActiveRecordsList
            activeRecords={activeRecords}
            handleRecordClick={handleRecordClick}
            className={styles.activeRecords}
          />
        </>
      )}
      <HorizontalSeparator text="Activities" className={styles.separator} />
      <div className={styles.info}>Click on activity to start tracking</div>
      <ActivitiesList
        activities={currentActivities}
        activeRecords={activeRecords}
        handleActivityClick={handleActivityClick}
        className={styles.activitiesContainer}
      />
      {archivedActivities.length > 0 && (
        <>
          <HorizontalSeparator text="Archived" className={styles.separator} />
          <ArchivedActivitiesList
            activities={archivedActivities}
            handleDelete={handleDelete}
            handleRestore={handleRestore}
            className={styles.activitiesContainer}
          />
        </>
      )}
    </div>
  );

  // ______________
  // EVENT HANDLERS

  async function handleDelete(activity) {
    // display activity as loading while server is processing request
    dispatchActivities({ type: 'setLoading', activityId: activity.id });

    const { response } = await deleteActivity(activity.name);
    if (!response.ok) {
      dispatchActivities({ type: 'setNotLoading', activityId: activity.id });
      return toast.error('Failed to delete activity with name ' + activity.name, {
        id: 'delete-error',
      });
      // throw new Error('Failed to delete activity with name ' + activity.name);
    }

    dispatchActivities({ type: 'delete', activityId: activity.id });
  }

  async function handleRestore(activity) {
    // display activity as loading while server is processing request
    dispatchActivities({ type: 'setLoading', activityId: activity.id });

    const { response } = await restoreActivity(activity.name);
    if (!response.ok) {
      dispatchActivities({ type: 'setNotLoading', activityId: activity.id });
      return toast.error('Failed to restore activity', { id: 'restore-error' });
      // throw new Error(`Failed to restore activity`);
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
      return toast.error('Failed to stop tracking record', { id: 'stop-error' });
      // throw new Error('Failed to stop record tracking');
    }
  }

  async function handleActivityClick(activity, activeRecords) {
    const hasActiveRecord = activeRecords.find((r) => r.activityId === activity.id);
    // clicking on an activity that is already being tracked, stops tracking the activity
    if (hasActiveRecord) {
      return handleRecordClick(hasActiveRecord);
    }

    // optimistic UI - create fake record while server is processing request
    const fakeRecord = new FakeRecord(activity);
    dispatchActivities({ type: 'setLoading', activityId: activity.id });
    dispatchRecords({ type: 'createFake', fakeRecord });

    const { response, data: newRecord } = await createRecord({
      activityId: activity.id,
      startedAt: fakeRecord.startedAt,
    });
    if (!response.ok) {
      dispatchActivities({ type: 'setNotLoading', activityId: activity.id });
      dispatchRecords({ type: 'deleteFake', activityId: activity.id });
      return toast.error('Failed to start record', { id: 'start-error' });
      // throw new Error('Failed to start record');
    }

    // update fake record with real values
    dispatchRecords({
      type: 'swapFakeWithReal',
      activityId: activity.id,
      recordId: newRecord.id,
    });
    dispatchActivities({ type: 'setNotLoading', activityId: activity.id });
  }
}

export async function activitiesLoader() {
  const [
    { response: responseActivities, data: dataActivities },
    { response: responseActiveRecords, data: dataActiveRecords },
  ] = await Promise.all([getActivities(), getRecords('active=true')]);

  // moze se desiti da su oba errora - treba bolje obraditi
  if (!responseActivities.ok) {
    throw new Error('Get activities error');
  }
  if (!responseActiveRecords.ok) {
    throw new Error('Get active records error');
  }

  return {
    activities: dataActivities,
    activeRecords: dataActiveRecords,
  };
}

function ActivitiesList({ activities, handleActivityClick, activeRecords, className }) {
  return (
    <div className={className}>
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onClick={handleActivityClick}
          activeRecords={activeRecords}
        />
      ))}
      <CreateActivityCard />
    </div>
  );
}

function ArchivedActivitiesList({ activities, handleRestore, handleDelete, className }) {
  return (
    <div className={className}>
      {activities.map((activity) => (
        <ArchivedActivityCard
          key={activity.id}
          activity={activity}
          onRestore={handleRestore}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

function ActiveRecordsList({ activeRecords, handleRecordClick, className }) {
  return (
    <div className={className}>
      {activeRecords
        .toSorted((a, b) => {
          return new Date(b.startedAt) - new Date(a.startedAt);
        })
        .map((record) => (
          <ActiveRecordCard
            key={record.recordId}
            record={record}
            showEdit
            onClick={handleRecordClick}
            showSessionDetails
          />
        ))}
    </div>
  );
}

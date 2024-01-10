import { useLoaderData } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';
import ActivityCard from '../../components/ActivityCard/ActivityCard';
import styles from './home.module.css';
import CreateActivityCard from '../../components/CreateActivityCard/CreateActivityCard';
import ActiveRecord from '../../components/ActiveRecord/ActiveRecord';

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

export default function Home() {
  const {
    activitiesData: { activities },
    recordsData: { records: activeRecords },
  } = useLoaderData();
  const { user } = useAuth();
  console.log(activeRecords);

  return (
    <>
      {activeRecords.length > 0 && (
        <>
          <div className={styles.lineContainer}>
            <div className={styles.line}></div>
            <div className={styles.lineText}>Tracking</div>
            <div className={styles.line}></div>
          </div>
          <div className={styles.activeRecordsContainer}>
            <div className={styles.activeRecords}>
              {activeRecords.map((record) => (
                <ActiveRecord key={record.recordId} record={record} />
              ))}
            </div>
          </div>
        </>
      )}
      {/* <div>Home</div>
      <p>{user.email}</p> */}
      <div className={styles.lineContainer}>
        <div className={styles.line}></div>
        <div className={styles.lineText}>Activities</div>
        <div className={styles.line}></div>
      </div>
      <div className={styles.activitesContainer}>
        {activities
          .filter((activity) => !activity.archived)
          .map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        <CreateActivityCard />
      </div>
      <div className={styles.lineContainer}>
        <div className={styles.line}></div>
        <div className={styles.lineText}>Archived</div>
        <div className={styles.line}></div>
      </div>
      <div className={styles.activitesContainer}>
        {activities
          .filter((activity) => activity.archived)
          .map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
      </div>
    </>
  );
}

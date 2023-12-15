import { useLoaderData } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';
import ActivityCard from '../../components/ActivityCard/ActivityCard';
import styles from './home.module.css';

export async function loader() {
  const res = await fetch('http://localhost:8000/api/v1/activities', {
    method: 'GET',
    credentials: 'include',
  });

  return await res.json();
}

export default function Home() {
  const activities = useLoaderData().activities;
  const { user } = useAuth();

  return (
    <>
      {/* <div>Home</div>
      <p>{user.email}</p> */}
      <div className={styles.activitesContainer}>
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            allActivities={activities}
          />
        ))}
      </div>
    </>
  );
}

import { useLoaderData } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';

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
      <div>Home</div>
      <p>{user.email}</p>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>{activity.name}</li>
        ))}
      </ul>
    </>
  );
}

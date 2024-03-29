import { Navigate } from 'react-router-dom';

import {
  Activities,
  activitiesLoader,
  ActivityEditor,
  activityEditorCreateLoader,
  activityEditorUpdateLoader,
} from '../features/activities/routes';
import { Goal, goalLoader } from '../features/goals/routes';
import {
  Records,
  recordsLoader,
  RecordEditor,
  recordEditorUpdateLoader,
  recordEditorCreateLoader,
  recordEditorAction,
} from '../features/records/routes';
import { Statistics } from '../features/statistics/routes';
import { ErrorElement } from '../components/ErrorElement';

export const protectedRoutes = [
  {
    path: '/',
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Navigate to="activities" replace={true} />,
      },
      {
        path: 'activities',
        element: <Activities />,
        loader: activitiesLoader,
        errorElement: <ErrorElement />,
      },
      {
        path: 'activities/:activityName',
        element: <ActivityEditor type="edit" />,
        loader: activityEditorUpdateLoader,
      },
      {
        path: 'activities/create',
        element: <ActivityEditor />,
        loader: activityEditorCreateLoader,
      },
      {
        path: 'goals',
        element: <Goal />,
        loader: goalLoader,
      },
      {
        path: 'records',
        element: <Records />,
        loader: recordsLoader,
      },
      {
        path: 'records/create',
        element: <RecordEditor />,
        loader: recordEditorCreateLoader,
        action: recordEditorAction,
      },
      {
        path: 'records/:recordId',
        element: <RecordEditor />,
        loader: recordEditorUpdateLoader,
        action: recordEditorAction,
      },
      {
        path: 'statistics',
        element: <Statistics />,
      },
      {
        path: '*',
        element: <Navigate to="/activities" replace={true} />,
      },
    ],
  },
];

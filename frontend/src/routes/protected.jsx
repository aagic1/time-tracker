import { Navigate } from 'react-router-dom';

import {
  Activities,
  activitiesLoader,
  ActivityEditor,
  activityEditorLoader,
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

export const protectedRoutes = [
  {
    index: true,
    element: <Navigate to="activities" />,
  },
  {
    path: 'activities',
    element: <Activities />,
    loader: activitiesLoader,
  },
  {
    path: 'activities/:activityName',
    element: <ActivityEditor type="edit" />,
    loader: activityEditorLoader,
  },
  {
    path: 'activities/create',
    element: <ActivityEditor />,
    loader: activityEditorLoader,
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
    element: <div>Statistics page</div>,
  },
  {
    path: '*',
    element: <Navigate to="." replace={true} />,
  },
];

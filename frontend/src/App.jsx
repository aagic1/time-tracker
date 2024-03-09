import { createBrowserRouter, RouterProvider, useRouteError } from 'react-router-dom';

import Layout from './pages/Layout/Layout.jsx';
import AuthLayout from './pages/Auth/AuthLayout/AuthLayout.jsx';
import Login, { action as loginAction } from './features/auth/routes/Login/Login.jsx';
import Register, { action as registerAction } from './features/auth/routes/Register/Register.jsx';
import ForgotPassword, {
  action as forgotPasswordAction,
} from './features/auth/routes/ForgotPassword/ForgotPassword.jsx';
import ForgotPasswordConfirmation, {
  action as forgotPasswordConfirmationAction,
} from './features/auth/routes/ForgotPasswordConfirmation/ForgotPasswordConfirmation.jsx';
import ResetPassword, {
  action as ResetPasswordAction,
} from './features/auth/routes/ResetPassword/ResetPassword.jsx';
import VerifyEmail, {
  action as verifyEmailAction,
} from './features/auth/routes/VerifyEmail/VerifyEmail.jsx';
import Activities, {
  loader as activitiesLoader,
} from './features/activities/routes/Activities/Activities.jsx';

import AuthProvider from './features/auth/routes/AuthProvider.jsx';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';
import AuthRoutes from './components/AuthRoutes.jsx';
import ActivityEditor, {
  loader as activityEditorLoader,
} from './features/activities/routes/ActivityEditor/ActivityEditor.jsx';
import Goal, { loader as goalLoader } from './features/goals/routes/Goal/Goal.jsx';
import Records, { loader as recordsLoader } from './features/records/routes/Records/Records.jsx';
import RecordEditor, {
  loaderCreate as recordEditorCreateLoader,
  loaderUpdate as recordEditorUpdateLoader,
  action as recordEditorAction,
} from './features/records/routes/RecordEditor/RecordEditor.jsx';
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        element: <AuthRoutes />,
        children: [
          {
            element: <AuthLayout />,
            errorElement: <ErrorElement />,
            children: [
              {
                path: 'login',
                element: <Login />,
                action: loginAction,
              },
              {
                path: 'forgot-password',
                element: <ForgotPassword />,
                action: forgotPasswordAction,
              },
              {
                path: 'forgot-password-confirmation',
                element: <ForgotPasswordConfirmation />,
                action: forgotPasswordConfirmationAction,
              },
              {
                path: 'reset-password',
                element: <ResetPassword />,
                action: ResetPasswordAction,
              },
              {
                path: 'register',
                element: <Register />,
                action: registerAction,
              },
              {
                path: 'verify-email',
                element: <VerifyEmail />,
                action: verifyEmailAction,
              },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            index: true,
            element: <Activities />,
            loader: activitiesLoader,
            errorElement: <ErrorElement />,
          },
          {
            path: 'activities/:activityName',
            element: <ActivityEditor type="edit" />,
            loader: activityEditorLoader,
            errorElement: <ErrorElement />,
          },
          {
            path: 'activities/create',
            element: <ActivityEditor />,
            loader: activityEditorLoader,
            errorElement: <ErrorElement />,
          },
          {
            path: '/goals',
            element: <Goal />,
            loader: goalLoader,
            errorElement: <ErrorElement />,
          },
          {
            path: '/records',
            element: <Records />,
            loader: recordsLoader,
            errorElement: <ErrorElement />,
          },
          {
            path: '/records/create',
            element: <RecordEditor />,
            errorElement: <ErrorElement />,
            loader: recordEditorCreateLoader,
            action: recordEditorAction,
          },
          {
            path: '/records/:recordId',
            element: <RecordEditor />,
            errorElement: <ErrorElement />,
            loader: recordEditorUpdateLoader,
            action: recordEditorAction,
          },
          {
            path: '/statistics',
            element: <div>Statistics page</div>,
            errorElement: <ErrorElement />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  );
}

function ErrorElement() {
  const error = useRouteError();
  console.log('error element');
  console.log(error);
  return <div>{error.message}</div>;
}

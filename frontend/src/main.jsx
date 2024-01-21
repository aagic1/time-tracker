import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';

import Layout from './pages/Layout/Layout.jsx';
import AuthLayout from './pages/Auth/AuthLayout/AuthLayout.jsx';
import Login from './pages/Auth/Login/Login.jsx';
import Register, {
  action as registerAction,
} from './pages/Auth/Register/Register.jsx';
import ForgotPassword, {
  action as forgotPasswordAction,
} from './pages/Auth/ForgotPassword/ForgotPassword.jsx';
import ForgotPasswordConfirmation, {
  action as forgotPasswordConfirmationAction,
} from './pages/Auth/ForgotPasswordConfirmation/ForgotPasswordConfirmation.jsx';
import ResetPassword from './pages/Auth/ResetPassword/ResetPassword.jsx';
import VerifyEmail, {
  action as verifyEmailAction,
} from './pages/Auth/VerifyEmail/VerifyEmail.jsx';
import Home, { loader as homeLoader } from './pages/Home/Home.jsx';

import AuthProvider from './pages/Auth/AuthProvider.jsx';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';
import AuthRoutes from './components/AuthRoutes.jsx';
import ActivityEditor, {
  loader as activityEditorLoader,
} from './pages/ActivityEditor/ActivityEditor.jsx';
import Goal, { loader as goalLoader } from './pages/Goal/Goal.jsx';
import Records, { loader as recordsLoader } from './pages/Records/Records.jsx';

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
            errorElement: <div>Error auth layout</div>,
            children: [
              {
                path: 'login',
                element: <Login />,
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
            element: <Home />,
            loader: homeLoader,
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
            path: '/statistics',
            element: <div>Statistics page</div>,
            errorElement: <ErrorElement />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </React.StrictMode>
);

function ErrorElement() {
  let error = useRouteError();
  useEffect(() => {
    console.error(error);
  }, []);
  return <div>{error.message}</div>;
}

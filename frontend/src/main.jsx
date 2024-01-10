import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './pages/Layout/Layout.jsx';
import AuthLayout from './pages/Auth/AuthLayout/AuthLayout.jsx';
import Login from './pages/Auth/Login/Login.jsx';
import Register, {
  action as registerAction,
} from './pages/Auth/Register/Register.jsx';
import ForgotPassword, {
  action as forgotPasswordAction,
} from './pages/Auth/ForgotPassword/ForgotPassword.jsx';
import ForgotPasswordConfirmation from './pages/Auth/ForgotPasswordConfirmation/ForgotPasswordConfirmation.jsx';
import ResetPassword from './pages/Auth/ResetPassword/ResetPassword.jsx';
import VerifyEmail, {
  action as verifyEmailAction,
} from './pages/Auth/VerifyEmail/VerifyEmail.jsx';
import Home, { loader as homeLoader } from './pages/Home/Home.jsx';

import AuthProvider, {
  loader as authProviderLoader,
} from './pages/Auth/AuthProvider.jsx';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';
import AuthRoutes from './components/AuthRoutes.jsx';
import ActivityEditor, {
  loader as activityEditorLoader,
} from './pages/ActivityEditor/ActivityEditor.jsx';
import Goal, { loader as goalLoader } from './pages/Goal/Goal.jsx';

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    loader: authProviderLoader,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            element: <AuthRoutes />,
            children: [
              {
                element: <AuthLayout />,
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
              },
              {
                path: 'activity/:activityName',
                element: <ActivityEditor type="edit" />,
                loader: activityEditorLoader,
              },
              {
                path: 'activity/create',
                element: <ActivityEditor />,
                loader: activityEditorLoader,
              },
              {
                path: '/goals',
                element: <Goal />,
                loader: goalLoader,
              },
              {
                path: '/records',
                element: <div>Records page</div>,
              },
              {
                path: '/statistics',
                element: <div>Statistics page</div>,
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

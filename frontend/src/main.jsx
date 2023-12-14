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

import AuthProvider from './pages/Auth/AuthProvider.jsx';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';
import AuthRoutes from './components/AuthRoutes.jsx';

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
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
                path: '/goals',
                element: <div>Goals page</div>,
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

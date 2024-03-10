import { Navigate } from 'react-router-dom';

import {
  // route pages
  Register,
  VerifyEmail,
  Login,
  ForgotPassword,
  ForgotPasswordConfirmation,
  ResetPassword,

  // route actions
  registerAction,
  verifyEmailAction,
  loginAction,
  forgotPasswordAction,
  forgotPasswordConfirmationAction,
  resetPasswordAction,
} from '../features/auth/routes';
import { AuthLayout } from '../components/Layout';

export const publicRoutes = [
  {
    element: <AuthLayout />,
    children: [
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
        action: resetPasswordAction,
      },
      {
        path: '*',
        element: <Navigate to="/login" replace={true} />,
      },
    ],
  },
];

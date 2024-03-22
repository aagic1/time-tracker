// import { useRouteError } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './features/auth/context/AuthProvider';
import { AppRouterProvider } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <Toaster />
      <AppRouterProvider />
    </AuthProvider>
  );
}

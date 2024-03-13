// import { useRouteError } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './features/auth/components/AuthProvider';
import { AppRouterProvider } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <Toaster />
      <AppRouterProvider />
    </AuthProvider>
  );
}

// function ErrorElement() {
//   const error = useRouteError();
//   console.log('error element');
//   console.log(error);
//   return <div>{error.message}</div>;
// }

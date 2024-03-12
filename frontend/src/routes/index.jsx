import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAuth } from '../features/auth/routes/AuthProvider';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { MainLayout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner';

export function AppRouterProvider() {
  const { isLoggedIn } = useAuth();

  const routes = [
    {
      element: <MainLayout />,
      children: isLoggedIn ? protectedRoutes : publicRoutes,
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} fallbackElement={<LoadingSpinner />} />;
}

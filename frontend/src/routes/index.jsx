import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAuth } from '../features/auth/routes/AuthProvider';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { MainLayout } from '../components/Layout';

export function AppRouterProvider() {
  const { isLoggedIn } = useAuth();

  const routes = [
    {
      path: '/',
      element: <MainLayout />,
      children: isLoggedIn ? protectedRoutes : publicRoutes,
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router}></RouterProvider>;
}

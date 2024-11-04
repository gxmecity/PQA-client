import ErrorPage from '@/routes/ErrorPage'
import { Navigate, RouteObject } from 'react-router-dom'

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/login',
    lazy: () => import('./Auth/Login'),
  },
  {
    path: '/signup',
    lazy: () => import('./Auth/Signup'),
  },
  {
    path: '',
    lazy: () => import('./App/DashboardPage'),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        lazy: () => import('./App/Home'),
      },
    ],
  },
]

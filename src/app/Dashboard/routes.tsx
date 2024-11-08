import ErrorPage from '@/routes/ErrorPage'
import { Navigate, RouteObject } from 'react-router-dom'

export const dashboardRoutes: RouteObject[] = [
  {
    path: '',
    element: <Navigate to='/dashboard' />,
  },
  {
    path: '/login',
    lazy: () => import('./Auth/Login'),
  },
  {
    path: '/signup',
    lazy: () => import('./Auth/Signup'),
  },
  {
    path: '/dashboard',
    lazy: () => import('./App/DashboardPage'),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        lazy: () => import('./App/Home'),
      },
      {
        path: 'quiz',
        lazy: () => import('./App/Quiz/MyQuiz'),
      },
      {
        path: 'quiz/:id',
        lazy: () => import('./App/Quiz/Edit'),
      },
      {
        path: 'create-quiz',
        lazy: () => import('./App/Quiz/Create'),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to='/dashboard' />,
  },
]

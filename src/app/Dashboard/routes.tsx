import ErrorPage from '@/routes/ErrorPage'
import { Navigate, RouteObject } from 'react-router-dom'

export const dashboardRoutes: RouteObject[] = [
  {
    path: '',
    element: <Navigate to='/login' />,
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
        path: 'events',
        lazy: () => import('./App/Events/MyEvents'),
      },

      {
        path: 'quiz/:id',
        lazy: () => import('./App/Quiz/Edit'),
      },
      {
        path: 'create-quiz',
        lazy: () => import('./App/Quiz/Create'),
      },
      {
        path: 'teams',
        lazy: () => import('./App/Teams/Teams'),
        children: [
          {
            path: '',
            lazy: () => import('./App/Teams/RegisterTeam'),
          },
          {
            path: ':id',
            lazy: () => import('./App/Teams/EditTeam'),
          },
        ],
      },
    ],
  },
  {
    path: '/broadcast/:id',
    lazy: () => import('./App/Events/Broadcast'),
    errorElement: <ErrorPage />,
  },
  {
    path: '/quiz-event/:id',
    lazy: () => import('./App/Events/QuizEvent/QuizEvent'),
    errorElement: <ErrorPage />,
  },
  {
    path: '/join-event',
    lazy: () => import('./App/Events/QuizEvent/JoinEvent'),
    errorElement: <ErrorPage />,
  },
  {
    path: '/play',
    lazy: () => import('../Payer/Player'),
    errorElement: <ErrorPage />,
  },
  {
    path: '/host',
    lazy: () => import('../Host/Host'),
    errorElement: <ErrorPage />,
  },
  {
    path: '/team/reg/:id',
    lazy: () => import('../Website/Home/Team/RegisterTeam'),
    errorElement: <ErrorPage />,
  },
  {
    path: '/team/success',
    lazy: () => import('../Website/Home/Team/RegisterSuccess'),
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <Navigate to='/dashboard' />,
  },
]

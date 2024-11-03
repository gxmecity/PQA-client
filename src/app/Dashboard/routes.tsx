import { RouteObject } from 'react-router-dom'

export const dashboardRoutes: RouteObject[] = [
  {
    path: '',
    lazy: () => import('./Home/Home'),
  },
  {
    path: '/login',
    lazy: () => import('./Auth/Login'),
  },
  {
    path: '/signup',
    lazy: () => import('./Auth/Signup'),
  },
]

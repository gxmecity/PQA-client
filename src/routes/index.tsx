import { Navigate, createBrowserRouter } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import { dashboardRoutes } from '@/app/Dashboard/routes'

export const website = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('@/app/Website/Home/Home'),
    errorElement: <ErrorPage />,
    children: [],
  },
])

export const player = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('@/app/Dashboard/Dashboard'),
    errorElement: <ErrorPage />,
    children: [],
  },
])

export const dashboard = createBrowserRouter(
  [
    {
      path: '/',
      lazy: () => import('@/app/Dashboard/Dashboard'),
      errorElement: <ErrorPage />,
      children: dashboardRoutes,
    },
    {
      path: '*',
      element: <Navigate to='/' />,
    },
  ],
  {
    basename: '/app',
  }
)

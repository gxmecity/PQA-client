import { NavigationMenuDemo } from '@/components/DashboardNav'
import Loader from '@/components/Loader'
import { useAppSelector } from '@/redux/store'
import { useRetrieveUserSessionQuery } from '@/services/auth'
import { Navigate, Outlet } from 'react-router-dom'

export function Component() {
  const { user } = useAppSelector((state) => state.auth)
  const { isLoading } = useRetrieveUserSessionQuery(undefined, {
    skip: user !== undefined,
  })

  if (isLoading) return <Loader />

  if (!user) return <Navigate to='/login' />

  return (
    <main className=' flex flex-col h-full'>
      <NavigationMenuDemo name={user.fullname} />
      <Outlet />
    </main>
  )
}

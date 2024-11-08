import { NavigationMenuDemo } from '@/components/DashboardNav'
import { Outlet } from 'react-router-dom'

export function Component() {
  return (
    <main className=' flex flex-col h-full'>
      <NavigationMenuDemo />
      <Outlet />
    </main>
  )
}

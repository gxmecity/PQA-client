import { Outlet } from 'react-router-dom'

export const Component = () => {
  return (
    <div className='bg-background text-foreground h-dvh'>
      <Outlet />
    </div>
  )
}

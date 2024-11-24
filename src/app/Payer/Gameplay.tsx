import React from 'react'
import { Outlet } from 'react-router-dom'

export function Component() {
  return (
    <main className=' h-full flex flex-col'>
      <Outlet />
    </main>
  )
}

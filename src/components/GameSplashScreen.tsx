import React from 'react'
import bgImage from '@/assets/game bg.jpg'

interface Props {
  bagroundImage?: string
  children: React.ReactNode
}

function GameSplashScreen({ bagroundImage = bgImage, children }: Props) {
  return (
    <div className=' h-screen overflow-hidden'>
      <div className=' absolute h-full w-full'>
        <img
          src={bagroundImage}
          alt=''
          className=' h-full w-full object-cover'
        />
        <div className=' bg-game-background absolute h-full w-full left-0 top-0 opacity-60'></div>
      </div>
      <div className='absolute h-full w-full grid place-items-center z-10'>
        {children}
      </div>
    </div>
  )
}

export default GameSplashScreen

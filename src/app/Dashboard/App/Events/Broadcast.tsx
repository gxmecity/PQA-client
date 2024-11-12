import AppButton from '@/components/AppButton'
import Clock from '@/components/Countdown'
import GameInterface from '@/components/GameInterface'
import { useState } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import Game from './Game/Game'

export function Component() {
  const [broadcast, setBroadcast] = useState(false)

  const handle = useFullScreenHandle()

  const startBroadcast = () => {
    setBroadcast(true)

    // handle.enter()
  }

  return (
    <FullScreen handle={handle}>
      <main className=' h-dvh bg-gradient-to-tr from-white to-primary flex items-center justify-center text-center'>
        {broadcast ? (
          <Game />
        ) : (
          <GameInterface>
            <div className=' text-black max-w-5xl mx-auto flex flex-col items-center gap-10'>
              <h1 className=' font-bold text-2xl'>
                Pub Quiz Thursdays Game Week 1
              </h1>
              <p className=''>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
                ratione perspiciatis ea, laborum est tempora, molestias sequi
                sapiente eligendi, cumque consectetur illo? Hic iure sit
                architecto! Quos, dolorem totam. Eligendi.
              </p>
              <div className=' h-64 flex items-center justify-center'>
                Logo here
              </div>
              <Clock />
              <AppButton
                text='Start Broadcast'
                classname=' h-12 bg-black text-primary hover:bg-black font-bold w-full max-w-[300px] text-lg'
                onClick={startBroadcast}
              />
            </div>
          </GameInterface>
        )}
      </main>
    </FullScreen>
  )
}

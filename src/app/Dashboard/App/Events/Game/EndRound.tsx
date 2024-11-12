import React, { useEffect } from 'react'
import Leaderboard from './Leaderboard'

interface Props {
  isLastRound: boolean
  RoundTitle: string
  scores: { name: string; score: number; id: string }[]
  nextStep: () => void
}

export default function EndRound({
  isLastRound,
  RoundTitle,
  scores,
  nextStep,
}: Props) {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      nextStep()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <>
      <div className=' h-full mx-auto max-w-4xl flex flex-col gap-5'>
        <div className=' flex items-center justify-between gap-10'>
          <span className=' h-[2px] bg-black flex-auto'></span>
          <h1 className=' text-2xl font-semibold'>Standings - {RoundTitle}</h1>
          <span className=' h-[2px] bg-black flex-auto'></span>
        </div>
        <Leaderboard scores={scores} />
      </div>
      {isLastRound ? (
        <button className='absolute bottom-5 lef-1/2 -translate-x-1/2 bg-muted/40 text-white px-2 rounded-md py-2 text-sm animate-pulse'>
          Press{' '}
          <span className='bg-muted/60 font-medium p-1 rounded-sm'>Enter</span>{' '}
          for final scores
        </button>
      ) : (
        <button className='absolute bottom-5 lef-1/2 -translate-x-1/2 bg-muted/40 text-white px-2 rounded-md py-2 text-sm animate-pulse'>
          Press{' '}
          <span className='bg-muted/60 font-medium p-1 rounded-sm'>Enter</span>{' '}
          to begin next round
        </button>
      )}
    </>
  )
}

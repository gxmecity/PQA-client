import { useEffect } from 'react'

export default function RoundIntro({
  roundIndex,
  startTimer,
  title,
  skipRound,
}: {
  startTimer: () => void
  title: string
  roundIndex: number
  skipRound: () => void
}) {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      startTimer()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <div className='h-full flex items-center justify-center '>
      <div className=' h-56 bg-black/80 flex justify-around items-center w-full gap-5 px-10 max-w-5xl font-bold'>
        <h1 className='gd-text-primary text-5xl w-max'>Round {roundIndex}</h1>
        <span className=' h-[2px] bg-gradient-to-tr from-white to-primary flex-auto'></span>
        <h1 className='gd-text-primary text-5xl truncate max-w-[60%]'>
          {title}
        </h1>
      </div>
      <div className='absolute bottom-14 flex gap-5 items-center'>
        <button
          className=' bg-muted/40 text-white px-2 rounded-md py-2 text-sm  animate-pulse'
          onClick={startTimer}>
          Press{' '}
          <span className='bg-muted/60 font-medium p-1 rounded-sm'>Enter</span>{' '}
          to start this round
        </button>
        <span>OR</span>
        <button
          className=' bg-muted/40 text-white px-2 rounded-md py-2 text-sm  animate-pulse'
          onClick={skipRound}>
          Press{' '}
          <span className='bg-red-800/60 font-medium p-1 rounded-sm'>Esc</span>{' '}
          to skip this round
        </button>
      </div>
    </div>
  )
}

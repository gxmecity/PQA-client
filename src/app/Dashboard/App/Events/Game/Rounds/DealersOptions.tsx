import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface Props {
  questions: number
  answeredQuestions: number[]
  selectQuestion: (arg: number) => void
  endRound: () => void
  dealingTeams: Player[]
}

export default function DealersOptions({
  questions,
  answeredQuestions,
  selectQuestion,
  endRound,
  dealingTeams,
}: Props) {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      endRound()
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
      {!!dealingTeams.length && (
        <div className=' absolute left-5 bg-black/50 rounded-lg w-max px-5 text-white text-sm pb-5 min-w-40 max-h-[500px] overflow-auto z-20'>
          <div className=' flex flex-col gap-3'>
            <div className=' text-white/60 uppercase flex items-center justify-center gap-3 '>
              <span className=' flex-auto h-[1px] bg-white/60'></span>
              <small>Online Players:</small>
              <span className=' flex-auto h-[1px] bg-white/60'></span>
            </div>
            {dealingTeams.map((player, index) => (
              <button
                key={index}
                className=' h-10 rounded-md bg-black/60 w-full text-xs px-2 text-left flex items-center gap-2'>
                {player.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className=' h-full flex max-w-5xl mx-auto flex-col justify-start px-1'>
        <div className=' flex flex-auto w-full flex-wrap gap-4  items-center justify-center'>
          {Array.from({ length: questions }).map((_, index) => (
            <button
              type='button'
              key={index}
              disabled={answeredQuestions.includes(index)}
              onClick={() => selectQuestion(index)}
              className={cn(
                'w-16 h-16 border border-black font-semibold rounded-full flex items-center justify-center hover:bg-black hover:text-white',
                answeredQuestions.includes(index) &&
                  'bg-black text-white opacity-50'
              )}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <button
        className='absolute bottom-5 lef-1/2 -translate-x-1/2 bg-black/40 text-white px-2 rounded-md py-2 text-sm animate-pulse'
        onClick={endRound}>
        Press{' '}
        <span className='bg-black/60 font-medium p-1 rounded-sm'>Esc</span> to
        end round
      </button>
    </>
  )
}

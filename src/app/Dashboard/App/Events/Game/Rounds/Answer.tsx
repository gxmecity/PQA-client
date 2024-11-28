import { useEffect } from 'react'
import blackbox from '@/assets/Black Box PQT.png'

type Prop = {
  data: Answer
  isLastQuestion?: boolean
  goToNext: () => void
}

export default function Answer({ data, isLastQuestion, goToNext }: Prop) {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      goToNext()
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
      <div className=' h-full flex flex-col items-center justify-center'>
        <p className=' text-xl font-medium mb-3'>Answer:</p>
        <h1 className=' font-bold text-6xl'>{data.answer_text}</h1>
      </div>
      {data.is_blackbox && (
        <span className=' h-32 w-32 absolute bottom-0 right-16'>
          <img src={blackbox} alt='blackbox' />
        </span>
      )}
      {isLastQuestion ? (
        <button
          className='absolute bottom-5 lef-1/2 -translate-x-1/2 bg-black/40 text-white px-2 rounded-md py-2 text-sm animate-pulse'
          onClick={goToNext}>
          Press{' '}
          <span className='bg-black/60 font-medium p-1 rounded-sm'>Enter</span>{' '}
          end round
        </button>
      ) : (
        <button
          className='absolute bottom-5 lef-1/2 -translate-x-1/2 bg-black/40 text-white px-2 rounded-md py-2 text-sm animate-pulse'
          onClick={goToNext}>
          Press{' '}
          <span className='bg-black/60 font-medium p-1 rounded-sm'>Enter</span>{' '}
          for next question
        </button>
      )}
    </>
  )
}

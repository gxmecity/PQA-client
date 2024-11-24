import CircularProgress from '@/components/CircularProgress'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'

interface Props {
  data: Question
  questionNumber: number
  timer: number
  totalTime: number
  onTimeComplete: () => void
  shouldRevealAnswer: boolean
  isLastQuestion?: boolean
  goToNext: () => void
  shouldCountdown: boolean
  startTimer: () => void
}

export default function Question({
  data,
  timer,
  questionNumber,
  onTimeComplete,
  shouldRevealAnswer,
  totalTime,
  shouldCountdown,
  goToNext,
  startTimer,
}: Props) {
  const [animate, setAnimate] = useState(false)

  const startQuestionCountdown = () => {
    if (!shouldCountdown) return
    startTimer()
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      goToNext()
    }
  }

  useEffect(() => {
    startQuestionCountdown()
    if (!shouldRevealAnswer) setAnimate(true)

    const animationTimer = setTimeout(() => setAnimate(false), 700)

    return () => clearTimeout(animationTimer)
  }, [questionNumber])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [shouldRevealAnswer])

  if (data.standalone_media) return <></>

  return (
    <>
      <div
        className={cn(
          'flex h-full justify-center items-center  relative',
          animate ? 'slide-in-elliptic-top-fwd' : ''
        )}>
        <div className=' h-full w-full flex justify-center flex-col max-w-7xl mx-auto gap-16'>
          <div className=' flex items-center gap-2 justify-between w-full'>
            <div className=' text-left'>
              <p className=' text-xl font-medium mb-3'>
                Question {questionNumber}
              </p>
              <h1 className=' font-bold text-6xl'>{data.question_text}</h1>
            </div>
          </div>
          {data.question_type === 'multiple_choice' && (
            <div className=' grid grid-cols-2 w-full max-w-5xl mx-auto py-6 gap-8'>
              {data.multi_choice_options?.map(
                (item, index) =>
                  item && (
                    <div
                      key={index}
                      className=' text-4xl rounded-md py-5 border border-black'>
                      {item}
                    </div>
                  )
              )}
            </div>
          )}
        </div>

        {timer > 0 && (
          <div className=' absolute bottom-0 right-10'>
            <CircularProgress value={timer} total={totalTime} />
          </div>
        )}
      </div>
      <button
        className='absolute bottom-5 lef-1/2 -translate-x-1/2 bg-muted/40 text-white px-2 rounded-md py-2 text-sm animate-pulse'
        onClick={goToNext}>
        Press{' '}
        <span className='bg-muted/60 font-medium p-1 rounded-sm'>Enter</span>{' '}
        {shouldRevealAnswer ? 'to reveal answer' : 'for next question'}
      </button>
    </>
  )
}

import CircularProgress from '@/components/CircularProgress'
import { useEffect, useState } from 'react'

interface Props {
  data: QuestionElement
  questionNumber: number
  timer: number
  onTimeComplete: () => void
  shouldRevealAnswer: boolean
  shouldCounntdown?: boolean
  isLastQuestion: boolean
  goToNext: () => void
}

export default function Question({
  data,
  timer,
  questionNumber,
  onTimeComplete,
  shouldRevealAnswer,
  shouldCounntdown,
  goToNext,
}: Props) {
  const [countDownn, setCountDownn] = useState(timer)

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      goToNext()
    }
  }

  useEffect(() => {
    if (shouldCounntdown) {
      if (countDownn > 0) {
        const timerId = setInterval(() => {
          setCountDownn((prevSeconds) => prevSeconds - 1)
        }, 1000)

        return () => clearInterval(timerId)
      } else {
        onTimeComplete()
      }
    }
  }, [countDownn])

  useEffect(() => {
    setCountDownn(timer)
  }, [questionNumber])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  if (data.question.standalone_asset) return <></>

  return (
    <>
      <div className='flex h-full justify-center items-start flex-col max-w-7xl mx-auto gap-16 relative'>
        <div className=' flex items-center gap-2 justify-between w-full'>
          <div className=' text-left'>
            <p className=' text-xl font-medium mb-3'>
              Question {questionNumber}
            </p>
            <h1 className=' font-bold text-6xl'>
              {data.question.question_text}
            </h1>
          </div>
          {data.question.question_image && <div></div>}
        </div>
        {data.question.question_type === 'multiple_choice' && (
          <div className=' grid grid-cols-2 w-full max-w-5xl mx-auto py-6 gap-8'>
            {data.question.multi_choice_options?.map(
              (item) =>
                item && (
                  <div className=' text-4xl rounded-md py-5 border border-black'>
                    {item}
                  </div>
                )
            )}
          </div>
        )}

        {shouldCounntdown && !!countDownn && (
          <div className=' absolute bottom-0 right-0'>
            <CircularProgress value={countDownn} total={timer} />
          </div>
        )}
      </div>
      {shouldRevealAnswer && (
        <button className='absolute bottom-5 lef-1/2 -translate-x-1/2 bg-muted/40 text-white px-2 rounded-md py-2 text-sm animate-pulse'>
          Press{' '}
          <span className='bg-muted/60 font-medium p-1 rounded-sm'>Enter</span>{' '}
          to reveal answer
        </button>
      )}
    </>
  )
}

import CircularProgress from '@/components/CircularProgress'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

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
  startTimer: (arg?: () => void) => void
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
  const [videoPlayed, setVideoPlayed] = useState(false)
  const videoEl = useRef<any>(null)

  const attemptPlay = () => {
    videoEl &&
      videoEl.current &&
      videoEl.current.play().catch((error: any) => {
        console.error('Error attempting to play', error)
      })
  }

  const startQuestionCountdown = () => {
    if (!shouldCountdown || videoPlayed) return
    startTimer(onTimeComplete)
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      goToNext()
    }
  }

  useEffect(() => {
    if (data.question_media?.type !== 'video') {
      startQuestionCountdown()
    } else {
      attemptPlay()
    }
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

  if (data.standalone_media)
    return (
      <div className=' fixed h-dvh w-dvw left-0 top-0 bg-gradient-to-tr from-white to-primary'>
        {data.question_media?.type === 'video' && (
          <video
            style={{ width: '100%', height: '100%' }}
            playsInline
            controls
            src={data.question_media.url}
            ref={videoEl}
            onEnded={() => {
              startQuestionCountdown()
              setVideoPlayed(true)
            }}
          />
        )}
        {data.question_media?.type === 'image' && (
          <img
            src={data.question_media.url}
            alt='question image'
            className=' w-full h-full object-cover'
          />
        )}

        {timer > 0 && (
          <div className=' absolute bottom-20 right-10 z-20'>
            <CircularProgress
              value={timer}
              total={totalTime}
              color='#ffce1f'
              sizeClassname='size-40 text-2xl text-primary'
            />
          </div>
        )}
      </div>
    )

  return (
    <>
      <div
        className={cn(
          'flex h-full justify-center items-center',
          animate ? 'slide-in-elliptic-top-fwd' : ''
        )}>
        <div className=' h-full w-full flex justify-center flex-col max-w-7xl mx-auto gap-16'>
          <div className=' flex items-center gap-2 justify-between w-full'>
            <div className=' text-left w-full'>
              <p className=' text-xl font-medium mb-3'>
                Question {questionNumber}
              </p>
              <div className=' flex w-full flex-auto gap-2 justify-between'>
                <h1 className=' font-bold text-5xl'>{data.question_text}</h1>
                {!data.standalone_media && data.question_media?.url && (
                  <div className=' w-[400px]'>
                    {data.question_media.type === 'image' && (
                      <img src={data.question_media.url} alt='image' />
                    )}
                    {data.question_media?.type === 'video' && (
                      <video
                        style={{ width: '100%' }}
                        playsInline
                        controls
                        src={data.question_media.url}
                        ref={videoEl}
                        onEnded={() => {
                          startQuestionCountdown()
                          setVideoPlayed(true)
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
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
          <div className=' absolute bottom-20 right-10'>
            <CircularProgress value={timer} total={totalTime} />
          </div>
        )}
      </div>
      <button
        className='absolute bottom-5 lef-1/2 -translate-x-1/2 bg-black/40 text-white px-2 rounded-md py-2 text-sm animate-pulse'
        onClick={goToNext}>
        Press{' '}
        <span className='bg-black/60 font-medium p-1 rounded-sm'>Enter</span>{' '}
        {!shouldRevealAnswer || data.question_type === 'question_only'
          ? 'for next question'
          : 'to reveal answer'}
      </button>
    </>
  )
}

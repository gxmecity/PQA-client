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
  restartRound?: () => void
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
  restartRound,
}: Props) {
  const [animate, setAnimate] = useState(false)
  const [videoPlayed, setVideoPlayed] = useState(false)
  const [playingVideo, setPlayingVideo] = useState(false)
  const videoEl = useRef<any>(null)

  const restartGameRound = () => {
    if (restartRound) restartRound()
  }

  const attemptPlay = async () => {
    if (videoEl && videoEl.current) {
      try {
        await videoEl.current.play()
        setPlayingVideo(true)
      } catch (error) {
        console.error('Error attempting to play', error)
      }
    }
  }

  const startQuestionCountdown = () => {
    if (!shouldCountdown || videoPlayed) return
    startTimer(onTimeComplete)
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      goToNext()
    }

    if (event.key.toLowerCase() === 'r') {
      restartGameRound()
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
            controls={false}
            src={data.question_media.url}
            ref={videoEl}
            onEnded={() => {
              startQuestionCountdown()
              setVideoPlayed(true)
              setPlayingVideo(false)
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
        {!playingVideo && (
          <button
            className='absolute bottom-5 lef-1/2 -translate-x-1/2 bg-black/40 text-white px-2 rounded-md py-2 text-sm animate-pulse'
            onClick={goToNext}
            disabled={playingVideo}>
            Press{' '}
            <span className='bg-black/60 font-medium p-1 rounded-sm'>
              Enter
            </span>{' '}
            {!shouldRevealAnswer || data.question_type === 'question_only'
              ? 'for next question'
              : 'to reveal answer'}
          </button>
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
        <div className=' h-full w-full flex justify-center flex-col mx-auto gap-16'>
          <div className=' flex items-center gap-2 justify-between w-full'>
            <div className=' text-left w-full'>
              <p className=' text-2xl font-semibold mb-3'>
                Question {questionNumber}
              </p>
              <div className=' flex w-full flex-auto gap-2 justify-between'>
                <h1
                  className={cn(
                    ' font-bold',
                    data.question_media?.url ? 'text-6xl' : 'text-[5rem]'
                  )}>
                  {data.question_text}
                </h1>
                {data.question_media?.url && (
                  <div className=' w-[400px]'>
                    {data.question_media.type === 'image' && (
                      <img src={data.question_media.url} alt='image' />
                    )}
                    {data.question_media?.type === 'video' && (
                      <video
                        style={{ width: '100%' }}
                        playsInline
                        controls={false}
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

import { useRef, useState } from 'react'
import RoundIntro from './RoundIntro'
import { quizzes } from '@/data'
import Trivia from './Rounds/Trivia'
import Dealers from './Rounds/Dealers'

export default function Round() {
  const quiz = quizzes[0]
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)

  const [starting, setStarting] = useState(false)
  const [seconds, setSeconds] = useState(5)
  const timerRef = useRef<any>(null)
  const [round, setRound] = useState(0)

  const next = () => {
    if (round === quiz.rounds.length - 1) {
      setEnded(true)
      return
    }
    setRound((prev) => prev + 1)
    setStarted(false)
  }

  const roundComponents: any = {
    trivia: <Trivia data={quiz.rounds[round]} onRoundEnded={next} />,
    dealers_choice: <Dealers />,
  }

  const startTimer = () => {
    if (starting) return // Prevent multiple intervals

    setStarting(true) // Set timer as active
    setSeconds(5) // Reset the countdown to 5 seconds

    // Set up interval
    timerRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 1) {
          clearInterval(timerRef.current) // Clear interval at 0
          setStarting(false) // Set timer as inactive
          setStarted(true)
          return 0
        }
        return prevSeconds - 1
      })
    }, 1000)
  }

  if (ended) return <>Quiz Ended</>

  if (starting)
    return (
      <div className='h-full flex items-center justify-center flex-col gap-10 '>
        <p className='font-semibold text-xl'>Game is starting in</p>
        <h1 className='font-bold text-7xl'>{seconds}</h1>
        <p className='font-medium text-lg'>Answer faster to gain more points</p>
      </div>
    )

  if (!started)
    return (
      <RoundIntro
        startTimer={startTimer}
        title={quiz.rounds[round].round_name}
      />
    )

  return <>{roundComponents[quiz.rounds[round].round_type] || <></>}</>
}

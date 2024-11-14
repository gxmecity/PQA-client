import { Hand } from 'lucide-react'
import { useRef, useState } from 'react'
import Answer from './Answer'
import DealersOptions from './DealersOptions'
import Question from './Question'
import { RoundProps } from './Trivia'

export default function Dealers({ data, onRoundEnded }: RoundProps) {
  const [activeIndex, setactiveIndex] = useState<number | null>(null)
  const [starting, setStarting] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<any>(null)
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])
  const [revealAnswer, setRevealAnswer] = useState<boolean>(false)
  const [showBonus, setshowBonus] = useState(false)

  const selectQuestion = (arg: number) => {
    if (starting) return // Prevent multiple intervals

    setStarting(true) // Set timer as active
    setSeconds(3) // Reset the countdown to 5 seconds

    // Set up interval
    timerRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 1) {
          clearInterval(timerRef.current) // Clear interval at 0
          setStarting(false) // Set timer as inactive
          setactiveIndex(arg)
          setAnsweredQuestions((prev) => [...prev, arg])
          return 0
        }
        return prevSeconds - 1
      })
    }, 1000)
  }

  if (starting)
    return (
      <div className='h-full flex items-center justify-center flex-col gap-10 '>
        <p className='font-semibold text-xl'>Get Ready for your Question</p>
        <h1 className='font-bold text-7xl'>{seconds}</h1>
      </div>
    )

  if (activeIndex === null)
    return (
      <DealersOptions
        answeredQuestions={answeredQuestions}
        questions={data.questions}
        selectQuestion={selectQuestion}
        endRound={onRoundEnded}
      />
    )

  return (
    <>
      {!revealAnswer ? (
        <>
          <div className=' absolute right-5 bg-black/50 rounded-lg w-max px-5 text-white text-sm pb-5 min-w-40'>
            <div className='py-3'>
              <div className=' text-white/60 uppercase flex items-center justify-center gap-3 '>
                <span className=' flex-auto h-[1px] bg-white/60'></span>
                <small>Point to:</small>
                <span className=' flex-auto h-[1px] bg-white/60'></span>
              </div>
              <button
                onClick={() => setRevealAnswer(true)}
                className=' h-10 rounded-md bg-black/60 w-full text-xs px-2 text-left'>
                We Know Nothing
              </button>
            </div>
            {showBonus && (
              <div className=' flex flex-col gap-3'>
                <div className=' text-white/60 uppercase flex items-center justify-center gap-3 '>
                  <span className=' flex-auto h-[1px] bg-white/60'></span>
                  <small>Bonus to:</small>
                  <span className=' flex-auto h-[1px] bg-white/60'></span>
                </div>
                {Array.from({ length: 5 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setRevealAnswer(true)}
                    className=' h-10 rounded-md bg-black/60 w-full text-xs px-2 text-left flex items-center gap-2'>
                    <Hand size={18} className='text-primary' /> We Know Nothing
                  </button>
                ))}
              </div>
            )}
          </div>
          <Question
            data={data.questions[activeIndex]}
            onTimeComplete={() => setshowBonus(true)}
            timer={5}
            questionNumber={activeIndex + 1}
            shouldRevealAnswer={true}
            shouldCounntdown={true}
            isLastQuestion={false}
            goToNext={() => setRevealAnswer(true)}
          />
        </>
      ) : (
        <Answer
          data={data.questions[activeIndex].answer}
          isLastQuestion={false}
          goToNext={() => {
            setactiveIndex(null)
            setRevealAnswer(false)
            setshowBonus(false)
          }}
        />
      )}
    </>
  )
}

import EmptyState from '@/components/EmptyState'
import GameSplashScreen from '@/components/GameSplashScreen'
import { useAppSelector } from '@/redux/store'
import { RealtimeChannel } from 'ably'
import DealersChoice from './_components/DealersChoice'
import Question from './_components/Question'
import RoundIntro from './_components/RoundIntro'
import CountDownTimer from './_components/CountDownTimer'
import { useState } from 'react'

interface Props {
  hostChannel: RealtimeChannel
  timer: number
  questionTimer: number
}

function QuizRound({ hostChannel, timer, questionTimer }: Props) {
  const {
    round,
    question,
    isRevealAnswer,
    answeredQuestions,
    dealer_index,
    totalPlayers,
  } = useAppSelector((state) => state.game)
  const [questionSelected, setQuestionSelected] = useState(false)

  const selectQuestion = (index: number) => {
    hostChannel.publish('set-question-index', { index })
    setQuestionSelected(true)
  }

  if (timer) return <CountDownTimer timer={timer} />

  if (!round)
    return (
      <div className='h-full animate-pulse'>
        <EmptyState
          title='Waiting for Next Round....'
          description='Hold on while we fetch the next round...'
        />
      </div>
    )

  if (round.round_ended)
    return (
      <GameSplashScreen>
        <div>Round Ended</div>
      </GameSplashScreen>
    )

  if (!round.round_started)
    return <RoundIntro title={round.title} index={round.index + 1} />

  if (round.round_started && !question)
    return (
      <>
        {round.type === 'dealers_choice' && !questionSelected ? (
          <DealersChoice
            handleSelectQuestion={selectQuestion}
            totalQuestions={round.totalQuestions}
            answeredQuestions={answeredQuestions}
            dealer={totalPlayers[dealer_index]}
          />
        ) : (
          <div className=' h-full animate-pulse'>
            <EmptyState
              title='Waiting for Question...'
              description='Hold on while we fetch the next question'
            />
          </div>
        )}
      </>
    )

  return (
    <Question
      timer={questionTimer}
      questionTime={round.time}
      data={question!}
      revealAnswer={isRevealAnswer}
      onQuestionLoaded={() => setQuestionSelected(false)}
    />
  )
}

export default QuizRound

import Answer from './Answer'
import Question from './Question'
import { RealtimeChannel } from 'ably'
import { RoundLeaderboard } from '../Game'
import EndRound from '../EndRound'
import RoundIntro from '../RoundIntro'

interface TriviaProps {
  activeQuestionIndex: number
  roundindex: number
  round: Round
  canRevealAnswer: boolean
  revealAnswer: boolean
  hostChannel: RealtimeChannel
  started: boolean
  ended: boolean
  scores: RoundLeaderboard[]
  starting: boolean
  seconds: number
  isLastRound: boolean
  isLastQuestion: boolean
  startTimerFunction: () => void
}

export default function Trivia({
  activeQuestionIndex,
  round,
  roundindex,
  hostChannel,
  started,
  ended,
  scores,
  seconds,
  starting,
  isLastRound,
  canRevealAnswer,
  startTimerFunction,
  isLastQuestion,
  revealAnswer,
}: TriviaProps) {
  const handleTimeComplete = () => {}

  const goToNextQuestion = () => {
    if (seconds) return

    if (isLastQuestion) {
      if (!canRevealAnswer) {
        hostChannel.publish('start-answer-reveal', '')
      } else if (!revealAnswer) {
        hostChannel.publish('reveal-answer', {
          activeRound: roundindex,
          activeQuestion: activeQuestionIndex,
        })
      } else {
        hostChannel.publish('end-round', {})
      }
    } else {
      if (canRevealAnswer && !revealAnswer) {
        hostChannel.publish('reveal-answer', {
          activeRound: roundindex,
          activeQuestion: activeQuestionIndex,
        })
      } else {
        hostChannel.publish('next-question', {
          activeQuestion: activeQuestionIndex,
        })
      }
    }
  }

  const goToNextRound = () => {
    if (isLastRound) {
      hostChannel.publish('final-result', '')
    } else {
      hostChannel.publish('next-round', {
        activeRound: roundindex,
      })
    }
  }

  const roundLeaderboard = scores.find(
    (round) => round.round === roundindex
  ) ?? {
    round: roundindex,
    leaderboard: {},
  }

  if (ended)
    return (
      <EndRound
        RoundTitle={round.round_name}
        isLastRound={isLastRound}
        scores={roundLeaderboard}
        nextStep={goToNextRound}
      />
    )

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
        roundIndex={roundindex + 1}
        startTimer={() => {
          hostChannel.publish('start-round', {
            activeRound: roundindex,
          })
        }}
        title={round.round_name}
      />
    )

  if (revealAnswer)
    return (
      <Answer
        data={round.questions[activeQuestionIndex].answer}
        isLastQuestion={isLastQuestion}
        goToNext={goToNextQuestion}
      />
    )

  return (
    <Question
      data={round.questions[activeQuestionIndex].question}
      onTimeComplete={handleTimeComplete}
      timer={seconds}
      questionNumber={activeQuestionIndex + 1}
      shouldRevealAnswer={canRevealAnswer}
      shouldCountdown={!canRevealAnswer}
      isLastQuestion={isLastQuestion}
      totalTime={round.timer}
      goToNext={goToNextQuestion}
      startTimer={startTimerFunction}
    />
  )
}

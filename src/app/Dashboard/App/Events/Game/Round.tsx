import EndRound from './EndRound'
import { RoundLeaderboard } from './Game'
import RoundIntro from './RoundIntro'
import Dealers from './Rounds/Dealers'
import Trivia from './Rounds/Trivia'

interface Props {
  activeQuestionIndex: number | null
  activeRoundIndex: number
  startRoundFunction: () => void
  round: Round
  started: boolean
  ended: boolean
  scores: RoundLeaderboard[]
  starting: boolean
  seconds: number
  isLastRound: boolean
  nextFunction: () => void
  onRoundEnded: () => void
}

export default function Round({
  activeQuestionIndex,
  activeRoundIndex,
  startRoundFunction,
  round,
  scores,
  seconds,
  started,
  starting,
  isLastRound,
  ended,
  nextFunction,
  onRoundEnded,
}: Props) {
  const roundComponents: any = {}

  const roundLeaderboard = scores.find(
    (round) => round.round === activeRoundIndex
  ) ?? {
    round: activeRoundIndex,
    leaderboard: {},
  }

  if (ended)
    return (
      <EndRound
        RoundTitle={round.round_name}
        isLastRound={isLastRound}
        scores={roundLeaderboard}
        nextStep={nextFunction}
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
      <RoundIntro startTimer={startRoundFunction} title={round.round_name} />
    )

  return <>{roundComponents[round.round_type] || <></>}</>
}

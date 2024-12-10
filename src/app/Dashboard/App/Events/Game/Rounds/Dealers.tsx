import { Hand } from 'lucide-react'
import { useRef, useState } from 'react'
import Answer from './Answer'
import DealersOptions from './DealersOptions'
import Question from './Question'
import { RealtimeChannel } from 'ably'
import { BonusLineup, RoundLeaderboard } from '../Game'
import EndRound from '../EndRound'
import RoundIntro from '../RoundIntro'
import { AnimatedList } from '@/components/ui/animated-list'

export interface DealersChoiceProps {
  activeQuestionIndex: number | null
  roundindex: number
  round: Round
  revealAnswer: boolean
  isLastRound: boolean
  hostChannel: RealtimeChannel
  roomChannel: RealtimeChannel
  started: boolean
  ended: boolean
  scores: RoundLeaderboard
  seconds: number
  bonusLineup: BonusLineup[]
  dealingTeams: Player[]
  answeredQuestions: number[]
  startTimerFunction: (arg?: () => void) => void
}

export default function Dealers({
  activeQuestionIndex,
  round,
  roundindex,
  revealAnswer,
  isLastRound,
  hostChannel,
  roomChannel,
  started,
  ended,
  scores,
  seconds,
  bonusLineup,
  dealingTeams,
  answeredQuestions,
  startTimerFunction,
}: DealersChoiceProps) {
  const [starting, setStarting] = useState(false)
  const [timer, setTimer] = useState(0)
  const timerRef = useRef<any>(null)

  const selectQuestion = (arg: number) => {
    if (starting) return // Prevent multiple intervals

    setStarting(true) // Set timer as active
    setTimer(3) // Reset the countdown to 5 seconds

    // Set up interval
    timerRef.current = setInterval(async () => {
      await hostChannel.publish('set-question-index', {
        questionIndex: arg,
        activeRound: roundindex,
      })
      setTimer((prevSeconds) => {
        if (prevSeconds === 1) {
          clearInterval(timerRef.current) // Clear interval at 0
          setStarting(false) // Set timer as inactive
          return 0
        }
        return prevSeconds - 1
      })
    }, 1000)
  }

  const allowBonusPoints = () => {
    roomChannel.publish('allow-bonus', {
      allowBonus: true,
    })
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

  const goToNextQuestion = () => {
    if (
      activeQuestionIndex !== null &&
      round.questions[activeQuestionIndex].question.question_type ===
        'question_only'
    ) {
      hostChannel.publish('set-question-index', {
        questionIndex: null,
        activeRound: roundindex,
      })
    } else {
      hostChannel.publish('reveal-answer', {
        activeRound: roundindex,
        activeQuestion: activeQuestionIndex,
      })
    }
  }

  const awardPointToPlayer = async (
    playerId: string,
    isBonus: boolean,
    team_id?: string
  ) => {
    await hostChannel.publish('award-point', {
      playerId,
      isBonus,
      activeRound: roundindex,
      team_id,
    })

    goToNextQuestion()
  }

  const roundLeaderboard = scores[`round-${roundindex}`]

  const roundScores: LeaderboardEntry[] = Object.keys(roundLeaderboard).map(
    (item) => ({
      player: {
        name: roundLeaderboard[item].name,
        team_id: roundLeaderboard[item].team_id,
        id: item,
      },
      score: roundLeaderboard[item].score,
    })
  )

  if (ended)
    return (
      <EndRound
        RoundTitle={round.round_name}
        isLastRound={isLastRound}
        scores={roundScores}
        nextStep={goToNextRound}
      />
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

  if (starting)
    return (
      <div className='h-full flex items-center justify-center flex-col gap-10 '>
        <p className='font-semibold text-xl'>Get Ready for your Question</p>
        <h1 className='font-bold text-7xl'>{timer}</h1>
      </div>
    )

  if (activeQuestionIndex === null)
    return (
      <DealersOptions
        answeredQuestions={answeredQuestions}
        questions={round.questions.length}
        selectQuestion={selectQuestion}
        endRound={() => {
          hostChannel.publish('end-round', {})
        }}
        dealingTeams={dealingTeams}
      />
    )

  return (
    <>
      {!revealAnswer ? (
        <>
          {!!dealingTeams.length && (
            <div className=' absolute left-5 bg-black/50 rounded-lg w-max px-5 text-white text-sm pb-5 min-w-40 max-h-[500px] overflow-auto z-20'>
              <div className=' flex flex-col gap-3'>
                <div className=' text-white/60 uppercase flex items-center justify-center gap-3 '>
                  <span className=' flex-auto h-[1px] bg-white/60'></span>
                  <small>Point to:</small>
                  <span className=' flex-auto h-[1px] bg-white/60'></span>
                </div>
                {dealingTeams.map((player, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      awardPointToPlayer(player.clientId, false, player.team_id)
                    }
                    className=' h-10 rounded-md bg-black/60 w-full text-xs px-2 text-left flex items-center gap-2'>
                    {player.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!!bonusLineup.length && (
            <div className=' absolute right-5 bg-black/50 rounded-lg w-max px-5 text-white text-sm pb-5 min-w-40 z-20'>
              <div className=' flex flex-col gap-3'>
                <div className=' text-white/60 uppercase flex items-center justify-center gap-3 '>
                  <span className=' flex-auto h-[1px] bg-white/60'></span>
                  <small>Bonus to:</small>
                  <span className=' flex-auto h-[1px] bg-white/60'></span>
                </div>
                <AnimatedList>
                  {bonusLineup.slice(0, 5).map((player, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        awardPointToPlayer(
                          player.clientId,
                          true,
                          player.team_id
                        )
                      }
                      className=' h-10 rounded-md bg-black/60 w-full text-xs px-2 text-left flex items-center gap-2'>
                      {index + 1} <Hand size={18} className='text-primary' />{' '}
                      {player.name}
                    </button>
                  ))}
                </AnimatedList>
              </div>
            </div>
          )}
          <Question
            data={round.questions[activeQuestionIndex].question}
            onTimeComplete={allowBonusPoints}
            totalTime={round.timer}
            shouldCountdown
            timer={seconds}
            questionNumber={activeQuestionIndex + 1}
            shouldRevealAnswer
            goToNext={goToNextQuestion}
            startTimer={startTimerFunction}
          />
        </>
      ) : (
        <Answer
          data={round.questions[activeQuestionIndex].answer}
          goToNext={() => {
            hostChannel.publish('set-question-index', {
              questionIndex: null,
              activeRound: roundindex,
            })
          }}
        />
      )}
    </>
  )
}

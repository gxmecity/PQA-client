import EmptyState from '@/components/EmptyState'
import Loader from '@/components/Loader'
import { ablyClient } from '@/lib/ably'
import { useGetUserQuizDetailsQuery } from '@/services/quiz'
import { useEffect, useState } from 'react'
import { GameState } from '../Dashboard/App/Events/Game/Game'
import Dealers from './Dealers'
import FinalResults from './FinalResults'
import Triva from './Triva'
import WaitingArea from './WaitingArea'
import { Dices } from 'lucide-react'

interface Props {
  data: QuizEvent
  user: User
}

export default function Game({ data, user }: Props) {
  const { data: quiz, isLoading } = useGetUserQuizDetailsQuery(data.quiz)
  const [seconds, setSeconds] = useState<number>(0)
  const [startingRound, setstartingRound] = useState<boolean>(false)

  const [globalGameState, setglobalGameState] = useState<GameState>({
    players: [],
    remoteHostDevices: 0,
    leaderboard: {},
    quiz_started: false,
    quiz_ended: false,
    activeRound: 0,
    round_started: false,
    round_ended: false,
    activeQuestionIndex: null,
    roomOpen: false,
    canRevealAnswer: false,
    revealAnswer: false,
    bonusLineup: [],
    dealer: null,
    answeredQuestions: [],
  })

  const hostChannel = ablyClient.channels.get(`${data.entry_code}:host`)
  const roomChannel = ablyClient.channels.get(`${data.entry_code}:primary`)

  const subscribeToHostChannels = () => {
    hostChannel.subscribe('open-room', (msg) => {
      setglobalGameState((prev) => ({ ...prev, roomOpen: msg.data.open }))
    })
    hostChannel.subscribe('sync-state', (msg) => {
      setglobalGameState(msg.data)
    })
  }

  const sunscribeToRoomChannels = () => {
    roomChannel.subscribe('question-timer', (msg) => {
      setSeconds(msg.data.countDownSec)
    })
    roomChannel.subscribe('timer-ended', () => {
      setstartingRound(false)
    })
    roomChannel.subscribe('start-round-timer', (msg) => {
      setSeconds(msg.data.countDownSec)
      setstartingRound(true)
    })
  }

  useEffect(() => {
    subscribeToHostChannels()
    sunscribeToRoomChannels()

    hostChannel.presence.enter({
      name: user.fullname,
    })
  }, [])

  const openQuizRoom = () => {
    hostChannel.publish('open-room', { open: true })
  }

  const startQuiz = () => {
    hostChannel.publish('start-quiz', {})
  }

  if (isLoading) return <Loader />

  if (!quiz) return <EmptyState title='Quiz Not found' icon={<Dices />} />

  return (
    <>
      <div className=' h-10 bg-primary w-full flex items-center px-4 text-black'>
        Total players: {globalGameState.players.length}
      </div>
      <section className=' flex-auto w-full max-w-5xl px-5'>
        {globalGameState.quiz_ended ? (
          <FinalResults />
        ) : globalGameState.quiz_started ? (
          <>
            {quiz.rounds[globalGameState.activeRound].round_type ===
            'trivia' ? (
              <Triva
                activeQuestionIndex={globalGameState.activeQuestionIndex!}
                roundindex={globalGameState.activeRound}
                hostChannel={hostChannel}
                round={quiz.rounds[globalGameState.activeRound]}
                canRevealAnswer={globalGameState.canRevealAnswer}
                revealAnswer={globalGameState.revealAnswer}
                scores={globalGameState.leaderboard}
                seconds={seconds}
                started={globalGameState.round_started}
                ended={globalGameState.round_ended}
                starting={startingRound}
                isLastRound={
                  globalGameState.activeRound === quiz.rounds.length - 1
                }
                isLastQuestion={
                  globalGameState.activeQuestionIndex ===
                  quiz.rounds[globalGameState.activeRound].questions.length - 1
                }
              />
            ) : (
              <Dealers
                activeQuestionIndex={globalGameState.activeQuestionIndex}
                roundindex={globalGameState.activeRound}
                hostChannel={hostChannel}
                round={quiz.rounds[globalGameState.activeRound]}
                revealAnswer={globalGameState.revealAnswer}
                scores={globalGameState.leaderboard}
                seconds={seconds}
                started={globalGameState.round_started}
                ended={globalGameState.round_ended}
                isLastRound={
                  globalGameState.activeRound === quiz.rounds.length - 1
                }
                bonusLineup={globalGameState.bonusLineup}
                dealingTeams={globalGameState.players}
                answeredQuestions={globalGameState.answeredQuestions}
              />
            )}
          </>
        ) : (
          <WaitingArea
            broadcast={globalGameState.roomOpen}
            startBroadCast={openQuizRoom}
            startQuiz={startQuiz}
            joinCode={data.entry_code!}
          />
        )}
      </section>
    </>
  )
}

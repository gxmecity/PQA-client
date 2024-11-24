import AppButton from '@/components/AppButton'
import AppDialog from '@/components/AppDialog'
import GameInterface from '@/components/GameInterface'
import useFullscreen from '@/hooks/useFullScreen'
import {
  pointAllocationByTimeAnswered,
  removeSpaceFromAnswerString,
  splitCodeInHalf,
} from '@/lib/utils'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { GameEvent } from '../Broadcast'
import WaitingArea from './WaitingArea'
import Trivia from './Rounds/Trivia'
import Dealers from './Rounds/Dealers'
import FinalResultComponent from './FinalResultComponent'
import { PresenceMessage } from 'ably'
import { ablyClient } from '@/lib/ably'

interface Props {
  data: GameEvent
}

export interface RoundLeaderboard {
  round: number
  leaderboard: { [key: string]: number }
}

export type BonusLineup = Pick<Player, 'clientId' | 'name'>

export interface GameState {
  players: Player[]
  remoteHostDevices: number
  leaderboard: RoundLeaderboard[]
  quiz_started: boolean
  quiz_ended: boolean
  activeRound: number
  round_started: boolean
  round_ended: boolean
  activeQuestionIndex: number | null
  roomOpen: boolean
  canRevealAnswer: boolean
  bonusLineup: BonusLineup[]
  indexOfDealer: number
  answeredQuestions: number[]
}

export default function Game({ data }: Props) {
  const {
    event_channels: { hostChannel, roomChannel },
    event_data,
    quiz,
  } = data
  const [open, setOpen] = useState(true)
  const [skipTimer, setSkipTimer] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [startingRound, setStartingRound] = useState(false)
  const [revealAnswer, setRevealAnswer] = useState(false)
  const [
    finalLeaderboardShowPoitionIndex,
    setFinalLeaderboardShowPoitionIndex,
  ] = useState<number | null>(null)

  const enterFullScreen = useFullscreen()

  const [globalGameState, setGlobalGameState] = useState<GameState>({
    players: [],
    remoteHostDevices: 0,
    leaderboard: quiz.rounds.map((_, index) => ({
      round: index,
      leaderboard: {},
    })),
    quiz_started: false,
    quiz_ended: false,
    activeRound: 0,
    round_started: false,
    round_ended: false,
    activeQuestionIndex: null,
    roomOpen: false,
    canRevealAnswer: false,
    bonusLineup: [],
    indexOfDealer: 0,
    answeredQuestions: [],
  })

  const updatePresenceWithTimer = async (remainingTime: number) => {
    await roomChannel.presence.update({ remainingTime })
  }

  const liveSyncWithHostDevice = async (data: Partial<GameState>) => {
    await hostChannel.publish('sync-state', data)
  }

  const subscribeToHostChannels = () => {
    hostChannel.subscribe('open-room', (msg) => {
      // enterFullScreen()
      setGlobalGameState((prev) => ({ ...prev, roomOpen: msg.data.open }))
    })
    hostChannel.subscribe('start-quiz', () => {
      setGlobalGameState((prev) => ({
        ...prev,
        quiz_started: true,
        activeRound: 0,
      }))
      liveSyncWithHostDevice({ quiz_started: true, activeRound: 0 })
      roomChannel.publish('quiz-started', {
        quiz_started: true,
        round: {
          title: quiz.rounds[0].round_name,
          type: quiz.rounds[0].round_name,
          time: quiz.rounds[0].timer,
        },
      })
    })
    hostChannel.subscribe('start-round', async (msg) => {
      const activeRound = quiz.rounds[msg.data.activeRound]
      setGlobalGameState((prev) => ({
        ...prev,
        round_started: true,
        canRevealAnswer: false,
        indexOfDealer: 0,
        activeQuestionIndex: activeRound.round_type === 'trivia' ? 0 : null,
        answeredQuestions: [],
      }))
      setStartingRound(true)
      liveSyncWithHostDevice({
        round_started: true,
        canRevealAnswer: false,
        indexOfDealer: 0,
        activeQuestionIndex: activeRound.round_type === 'trivia' ? 0 : null,
        answeredQuestions: [],
      })
      roomChannel.publish('start-round', { round_started: true })
      if (activeRound.round_type === 'trivia') {
        await startTimer('start-round-timer', 5)
        publishQuestion(0)
      }
      setStartingRound(false)
    })
    hostChannel.subscribe('next-question', (msg) => {
      setSkipTimer(false)
      setRevealAnswer(false)
      const prevQuestionIndex = msg.data.activeQuestion
      const nextQuestionIndex = prevQuestionIndex + 1
      setGlobalGameState((prev) => ({
        ...prev,
        activeQuestionIndex: nextQuestionIndex,
      }))
      liveSyncWithHostDevice({ activeQuestionIndex: nextQuestionIndex })
      publishQuestion(nextQuestionIndex)
    })
    hostChannel.subscribe('set-question-index', (msg) => {
      const nextQuestionIndex = msg.data.questionIndex
      setGlobalGameState((prev) => ({
        ...prev,
        activeQuestionIndex: nextQuestionIndex,
        bonusLineup: [],
      }))
      liveSyncWithHostDevice({
        activeQuestionIndex: nextQuestionIndex,
        bonusLineup: [],
      })
      if (nextQuestionIndex) publishQuestion(nextQuestionIndex)
    })
    hostChannel.subscribe('start-answer-reveal', () => {
      setGlobalGameState((prev) => ({
        ...prev,
        canRevealAnswer: true,
        activeQuestionIndex: 0,
      }))
      liveSyncWithHostDevice({
        canRevealAnswer: true,
        activeQuestionIndex: 0,
      })
    })
    hostChannel.subscribe('reveal-answer', (msg) => {
      setRevealAnswer(true)
      roomChannel.publish('correct-answer', {
        answer:
          quiz.rounds[msg.data.activeRound].questions[msg.data.activeQuestion]
            .answer.answer_text,
      })
    })
    hostChannel.subscribe('award-point', (msg) => {
      updatePlayerScore(msg.data.playerId, msg.data.isBonus ? 5 : 10)
    })
    hostChannel.subscribe('end-round', async () => {
      setGlobalGameState((prev) => ({ ...prev, round_ended: true }))
      liveSyncWithHostDevice({ round_ended: true })
      roomChannel.publish('round-ended', { round_ended: true })
    })
    hostChannel.subscribe('next-round', (msg) => {
      const currentRound = msg.data.activeRound
      const nextRound = currentRound + 1
      setGlobalGameState((prev) => ({
        ...prev,
        activeRound: nextRound,
        round_ended: false,
        round_started: false,
      }))
      liveSyncWithHostDevice({
        activeRound: nextRound,
        round_ended: false,
        round_started: false,
      })
      roomChannel.publish('next-round', {
        round: {
          title: quiz.rounds[nextRound].round_name,
          type: quiz.rounds[nextRound].round_name,
          time: quiz.rounds[nextRound].timer,
        },
      })
    })
    hostChannel.subscribe('final-result', () => {
      setGlobalGameState((prev) => ({ ...prev, quiz_ended: true }))
      liveSyncWithHostDevice({ quiz_ended: true })
    })
    hostChannel.subscribe('leaderboard-next', () => {
      setFinalLeaderboardShowPoitionIndex((prev) =>
        prev !== null ? prev - 1 : 5
      )
    })
    hostChannel.subscribe('end-quiz', () => {})
  }

  useEffect(() => {
    hostChannel.presence.subscribe('enter', (remote) => {
      setGlobalGameState((prev) => ({
        ...prev,
        remoteHostDevices: prev.remoteHostDevices + 1,
      }))
      liveSyncWithHostDevice(globalGameState)
      toast.success('Remote Device Connected', {
        description: `Device ${remote.clientId} joined as a remote host`,
      })
    })
    hostChannel.presence.subscribe('leave', (remote) => {
      setGlobalGameState((prev) => ({
        ...prev,
        remoteHostDevices: prev.remoteHostDevices - 1,
      }))
      toast.success('Remote Device Disconnected', {
        description: `Device ${remote.clientId} disconnected as a remote host`,
      })
    })
    roomChannel.presence.subscribe('enter', (player) => {
      handleNewPlayerJoined(player)
    })
    roomChannel.presence.subscribe('leave', (player) => {
      console.log(player)
    })

    subscribeToHostChannels()
  }, [data])

  const startTimer = async (event: string, countdown: number) => {
    while (countdown >= 0) {
      setSeconds(countdown)

      roomChannel.publish(event, {
        countDownSec: countdown,
      })
      await new Promise((resolve) => setTimeout(resolve, 1000))
      countdown -= 1
      if (event === 'question-timer' && skipTimer) break
    }

    await roomChannel.publish('timer-ended', { message: 'Time is up!' })
  }

  const openQuizRoomManually = () => {
    hostChannel.publish('open-room', {
      open: true,
    })
  }

  const publishQuestion = async (index: number) => {
    const question =
      quiz.rounds[globalGameState.activeRound].questions[index].question
    await roomChannel.publish('new-question', {
      question,
      index,
    })
    liveSyncWithHostDevice({ activeQuestionIndex: index })
    setGlobalGameState((prev) => ({ ...prev, activeQuestionIndex: index }))
  }

  const startQuestionCountdownTimer = async (callback?: () => void) => {
    const time = quiz.rounds[globalGameState.activeRound].timer
    if (!time) return

    await startTimer('question-timer', time)
    if (callback) callback()
  }

  const handleNewPlayerJoined = (player: PresenceMessage) => {
    const newPlayerData: Player = {
      clientId: player.clientId,
      avatar_url: player.data.avater,
      team_id: player.data.team_id,
      name: player.data.name,
      is_online: true,
    }

    const updatedleaderBoard: RoundLeaderboard[] =
      globalGameState.leaderboard.map((item) => ({
        round: item.round,
        leaderboard: {
          ...item.leaderboard,
          [player.clientId]: 0,
        },
      }))
    setGlobalGameState((prev) => ({
      ...prev,
      players: [...prev.players, newPlayerData],
      leaderboard: updatedleaderBoard,
    }))
    const playerChannel = ablyClient.channels.get(
      `${event_data.entry_code}:player-${player.clientId}`
    )

    playerChannel.subscribe('submit-answer', (msg) => {
      const client = msg.clientId

      if (!globalGameState.activeQuestionIndex || !client) return
      const activeQuestionAnswer =
        quiz.rounds[globalGameState.activeRound].questions[
          globalGameState.activeQuestionIndex
        ].answer.answer_text
      if (
        removeSpaceFromAnswerString(msg.data.answer) ===
        removeSpaceFromAnswerString(activeQuestionAnswer)
      ) {
        const point = pointAllocationByTimeAnswered(
          msg.data.time,
          quiz.rounds[globalGameState.activeRound].timer
        )

        updatePlayerScore(client, point)
      }
    })

    playerChannel.subscribe('request-bonus', (msg) => {
      if (globalGameState.bonusLineup.length < 5) {
        const updatedBonusList: BonusLineup[] = [
          ...globalGameState.bonusLineup,
          {
            clientId: msg.clientId!,
            name: msg.data.name,
          },
        ]
        setGlobalGameState((prev) => ({
          ...prev,
          bonusLineup: updatedBonusList,
        }))
        liveSyncWithHostDevice({ bonusLineup: updatedBonusList })
      }
    })
  }

  const updatePlayerScore = (playerId: string, point: number) => {
    const activeRoundLeaderBoard = globalGameState.leaderboard.find(
      (item) => item.round === globalGameState.activeRound
    )

    if (!activeRoundLeaderBoard) return

    activeRoundLeaderBoard.leaderboard[playerId] =
      (activeRoundLeaderBoard.leaderboard[playerId] || 0) + point

    setGlobalGameState((prev) => ({
      ...prev,
      leaderboard: [...prev.leaderboard, activeRoundLeaderBoard],
    }))
  }

  const publishPlayerScoresToPlayerChannels = async () => {}

  if (!globalGameState.roomOpen)
    return (
      <>
        <GameInterface
          numberOfPlayers={globalGameState.players.length}
          hostDevices={globalGameState.remoteHostDevices}>
          <div className=' text-black max-w-5xl mx-auto flex flex-col items-center gap-10'>
            <h1 className=' font-bold text-2xl'>{event_data.title}</h1>
            <p className=''>Game Host: {event_data.creator.fullname}</p>
            <div className=' h-64 flex items-center justify-center'>
              Logo here
            </div>
            <AppButton
              text='Start Game'
              classname=' h-12 bg-black text-primary hover:bg-black font-bold w-full max-w-[300px] text-lg'
              onClick={openQuizRoomManually}
            />
          </div>
        </GameInterface>
        <AppDialog open={open} setOpen={setOpen} title='Quiz Room Created'>
          <div className=' text-center flex flex-col items-center gap-3'>
            <p className='text-sm'>Host Code:</p>
            <h1 className=' font-bold text-2xl text-primary py-2 px-4 bg-muted rounded-lg'>
              {splitCodeInHalf(event_data.host_entry_code!)}
            </h1>
            <small>
              <span className=' font-semibold text-primary'>
                DO NOT SHARE THIS CODE.
              </span>{' '}
              Go to <span className=' underline'>quiz.gxmecity.com</span> and
              enter this host code to remotely control your quiz.
            </small>
            <div className=' flex items-center justify-between gap-5 w-full'>
              <span className=' h-[0.5px] bg-primary flex-auto'></span>
              <p>OR</p>
              <span className=' h-[0.5px] bg-primary flex-auto'></span>
            </div>
            <AppButton
              text='Start Game Manually'
              classname=' h-12 font-bold w-full max-w-[300px] text-lg'
              onClick={openQuizRoomManually}
            />
          </div>
        </AppDialog>
      </>
    )

  return (
    <GameInterface
      joinCode={data.event_data.entry_code}
      numberOfPlayers={globalGameState.players.length}
      hostDevices={globalGameState.remoteHostDevices}>
      {globalGameState.quiz_ended ? (
        <FinalResultComponent />
      ) : !globalGameState.quiz_started ? (
        <WaitingArea
          joinedPlayers={globalGameState.players}
          title={event_data.title}
          startQuiz={() => {
            hostChannel.publish('start-quiz', {})
          }}
        />
      ) : quiz.rounds[globalGameState.activeRound].round_type === 'trivia' ? (
        <Trivia
          activeQuestionIndex={globalGameState.activeQuestionIndex!}
          roundindex={globalGameState.activeRound}
          hostChannel={hostChannel}
          round={quiz.rounds[globalGameState.activeRound]}
          canRevealAnswer={globalGameState.canRevealAnswer}
          revealAnswer={revealAnswer}
          scores={globalGameState.leaderboard}
          seconds={seconds}
          started={globalGameState.round_started}
          ended={globalGameState.round_ended}
          starting={startingRound}
          isLastRound={globalGameState.activeRound === quiz.rounds.length - 1}
          isLastQuestion={
            globalGameState.activeQuestionIndex ===
            quiz.rounds[globalGameState.activeRound].questions.length - 1
          }
          startTimerFunction={startQuestionCountdownTimer}
        />
      ) : (
        <Dealers
          activeQuestionIndex={globalGameState.activeQuestionIndex}
          roundindex={globalGameState.activeRound}
          hostChannel={hostChannel}
          round={quiz.rounds[globalGameState.activeRound]}
          revealAnswer={revealAnswer}
          scores={globalGameState.leaderboard}
          seconds={seconds}
          started={globalGameState.round_started}
          ended={globalGameState.round_ended}
          isLastRound={globalGameState.activeRound === quiz.rounds.length - 1}
          bonusLineup={globalGameState.bonusLineup}
          dealingTeam={globalGameState.players[globalGameState.indexOfDealer]}
        />
      )}
    </GameInterface>
  )
}

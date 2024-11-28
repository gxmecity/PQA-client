import AppButton from '@/components/AppButton'
import AppDialog from '@/components/AppDialog'
import GameInterface from '@/components/GameInterface'
import useFullscreen from '@/hooks/useFullScreen'
import {
  initializeRoundLeaderboard,
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
import AppLogo from '@/components/AppLogo'
import { PlayerGameState } from '@/app/Payer/Game'

interface Props {
  data: GameEvent
}

export interface TeamGameScore {
  [key: string]: {
    score: number
    name: string
  }
}

export interface RoundLeaderboard {
  [key: string]: TeamGameScore
}

export type BonusLineup = Pick<Player, 'clientId' | 'name'>

export interface GameState {
  players: Player[]
  remoteHostDevices: number
  leaderboard: RoundLeaderboard
  quiz_started: boolean
  quiz_ended: boolean
  activeRound: number
  round_started: boolean
  round_ended: boolean
  activeQuestionIndex: number | null
  roomOpen: boolean
  canRevealAnswer: boolean
  revealAnswer: boolean
  bonusLineup: BonusLineup[]
  dealer: Player | null
  answeredQuestions: number[]
}

export default function Game({ data }: Props) {
  const {
    event_channels: { hostChannel, roomChannel },
    event_data,
    quiz,
  } = data
  const [open, setOpen] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [startingRound, setStartingRound] = useState(false)
  const [
    finalLeaderboardShowPoitionIndex,
    setFinalLeaderboardShowPoitionIndex,
  ] = useState<number | null>(null)

  const enterFullScreen = useFullscreen()

  const [globalGameState, setGlobalGameState] = useState<GameState>({
    players: [],
    remoteHostDevices: 0,
    leaderboard: initializeRoundLeaderboard(quiz.rounds),
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
  const [playerGameState, setplayerGameState] = useState<PlayerGameState>({
    question: null,
    round: null,
    quiz_started: false,
    quiz_ended: false,
    questionIndex: 0,
  })

  const liveSyncWithHostDevice = async (data: Partial<GameState>) => {
    await hostChannel.publish('sync-state', data)
  }

  const subscribeToHostChannels = () => {
    hostChannel.subscribe('open-room', (msg) => {
      enterFullScreen()
      setGlobalGameState((prev) => ({ ...prev, roomOpen: msg.data.open }))
    })
    hostChannel.subscribe('start-quiz', () => {
      setGlobalGameState((prev) => {
        const updatedState = {
          ...prev,
          quiz_started: true,
          activeRound: 0,
        }
        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
      roomChannel.publish('start-quiz', {
        quiz_started: true,
        round: {
          title: quiz.rounds[0].round_name,
          type: quiz.rounds[0].round_type,
          time: quiz.rounds[0].timer,
          index: 0,
          round_started: false,
          round_ended: false,
        },
      })

      setplayerGameState((prev) => ({
        ...prev,
        quiz_started: true,
        round: {
          title: quiz.rounds[0].round_name,
          type: quiz.rounds[0].round_type,
          time: quiz.rounds[0].timer,
          index: 0,
          round_started: false,
          round_ended: false,
        },
      }))
    })
    hostChannel.subscribe('start-round', async (msg) => {
      const activeRound = quiz.rounds[msg.data.activeRound]
      setGlobalGameState((prev) => {
        const updatedState = {
          ...prev,
          round_started: true,
          canRevealAnswer: false,
          dealer: prev.players[0],
          activeQuestionIndex: activeRound.round_type === 'trivia' ? 0 : null,
          answeredQuestions: [],
        }
        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
      setStartingRound(true)
      roomChannel.publish('start-round', { round_started: true })
      setplayerGameState((prev) => ({
        ...prev,
        round: {
          ...prev.round!,
          round_started: true,
        },
      }))

      if (activeRound.round_type === 'trivia') {
        await startTimer('start-round-timer', 5)
        publishQuestion(0, msg.data.activeRound)
      }
      setStartingRound(false)
    })
    hostChannel.subscribe('next-question', (msg) => {
      const prevQuestionIndex = msg.data.activeQuestion
      const nextQuestionIndex = prevQuestionIndex + 1
      const roundIndex = msg.data.activeRound
      const shouldNotpublish = msg.data.canRevealAnswer

      setGlobalGameState((prev) => {
        const updatedState: GameState = {
          ...prev,
          revealAnswer: false,
          activeQuestionIndex: nextQuestionIndex,
        }

        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
      if (!shouldNotpublish) publishQuestion(nextQuestionIndex, roundIndex)
    })
    hostChannel.subscribe('set-question-index', (msg) => {
      const nextQuestionIndex = msg.data.questionIndex
      const activeRound = msg.data.activeRound

      if (nextQuestionIndex !== null) {
        setGlobalGameState((prev) => {
          const updatedState: GameState = {
            ...prev,
            revealAnswer: false,
            activeQuestionIndex: nextQuestionIndex,
            bonusLineup: [],
            answeredQuestions: [...prev.answeredQuestions, nextQuestionIndex],
          }
          liveSyncWithHostDevice(updatedState)
          return updatedState
        })
        publishQuestion(nextQuestionIndex, activeRound)
      } else {
        setGlobalGameState((prev) => {
          const updatedState = {
            ...prev,
            activeQuestionIndex: nextQuestionIndex,
            bonusLineup: [],
          }
          liveSyncWithHostDevice(updatedState)
          return updatedState
        })
      }

      roomChannel.publish('allow-bonus', { allowBonus: false })
    })
    hostChannel.subscribe('start-answer-reveal', () => {
      setGlobalGameState((prev) => {
        const updatedState = {
          ...prev,
          canRevealAnswer: true,
          activeQuestionIndex: 0,
        }
        liveSyncWithHostDevice(updatedState)

        return updatedState
      })
    })
    hostChannel.subscribe('reveal-answer', (msg) => {
      setGlobalGameState((prev) => {
        const updatedState = {
          ...prev,
          revealAnswer: true,
        }
        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
      roomChannel.publish('correct-answer', {
        answer:
          quiz.rounds[msg.data.activeRound].questions[msg.data.activeQuestion]
            .answer.answer_text,
      })
    })
    hostChannel.subscribe('award-point', (msg) => {
      updatePlayerScore(
        msg.data.playerId,
        msg.data.isBonus ? 5 : 10,
        msg.data.activeRound
      )
    })
    hostChannel.subscribe('end-round', async () => {
      setGlobalGameState((prev) => {
        const updatedState = { ...prev, round_ended: true, revealAnswer: false }
        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
      roomChannel.publish('round-ended', { round_ended: true })
      setplayerGameState((prev) => ({
        ...prev,
        round: {
          ...prev.round!,
          round_ended: true,
        },
      }))
    })
    hostChannel.subscribe('next-round', (msg) => {
      const currentRound = msg.data.activeRound
      const nextRound = currentRound + 1
      setGlobalGameState((prev) => {
        const updatedState = {
          ...prev,
          activeRound: nextRound,
          round_ended: false,
          round_started: false,
        }
        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
      roomChannel.publish('next-round', {
        round: {
          title: quiz.rounds[nextRound].round_name,
          type: quiz.rounds[nextRound].round_type,
          time: quiz.rounds[nextRound].timer,
          index: nextRound,
          round_started: false,
          round_ended: false,
        },
      })
      setplayerGameState((prev) => ({
        ...prev,
        round: {
          title: quiz.rounds[nextRound].round_name,
          type: quiz.rounds[nextRound].round_type,
          time: quiz.rounds[nextRound].timer,
          index: nextRound,
          round_started: false,
          round_ended: false,
        },
      }))
    })
    hostChannel.subscribe('final-result', () => {
      setGlobalGameState((prev) => {
        const updatedState = { ...prev, quiz_ended: true }

        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
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
      setGlobalGameState((prev) => {
        const updatedState = {
          ...prev,
          remoteHostDevices: prev.remoteHostDevices + 1,
        }
        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
      toast.success('Remote Device Connected', {
        description: `Device ${remote.clientId} joined as a remote host`,
      })
    })
    hostChannel.presence.subscribe('leave', (remote) => {
      setGlobalGameState((prev) => {
        const updatedState = {
          ...prev,
          remoteHostDevices: prev.remoteHostDevices - 1,
        }
        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
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
      await roomChannel.publish(event, {
        countDownSec: countdown,
      })
      await new Promise((resolve) => setTimeout(resolve, 1000))
      countdown -= 1
    }

    if (event === 'question-timer') {
      await roomChannel.publish('timer-ended', { message: 'Time is up!' })
    }
  }

  const openQuizRoomManually = () => {
    hostChannel.publish('open-room', {
      open: true,
    })
  }

  const publishQuestion = async (index: number, roundIndex: number) => {
    const question = quiz.rounds[roundIndex].questions[index].question
    await roomChannel.publish('new-question', {
      question,
      index,
    })
    setGlobalGameState((prev) => {
      const updatedState = { ...prev, activeQuestionIndex: index }
      liveSyncWithHostDevice(updatedState)
      return updatedState
    })
    setplayerGameState((prev) => ({ ...prev, question: question }))
  }

  const startQuestionCountdownTimer = async (callback?: () => void) => {
    const time = quiz.rounds[globalGameState.activeRound].timer
    if (!time) return

    await startTimer('question-timer', time)
    if (callback) callback()
  }

  const handleNewPlayerJoined = (player: PresenceMessage) => {
    const newPlayerData: Player = {
      clientId: player.data.clientId,
      avatar_url: player.data.avatar,
      team_id: player.data.team_id,
      name: player.data.name,
    }
    setGlobalGameState((prev) => {
      const updatedState = {
        ...prev,
        players: [...prev.players, newPlayerData],
      }
      liveSyncWithHostDevice(updatedState)
      return updatedState
    })
    toast.success('New Player Joined', {
      description: `${newPlayerData.name} is in the house!!`,
    })
    const playerChannel = ablyClient.channels.get(
      `${event_data.entry_code}:player-${player.data.clientId}`
    )

    setplayerGameState((prev) => {
      playerChannel.publish('sync-state', {
        gameState: prev,
      })
      return prev
    })

    playerChannel.subscribe('submit-answer', (msg) => {
      const clientId = msg.data.clientId
      const activeRound = msg.data.activeRound
      const questionIndex = msg.data.activeQuestion
      const answer = msg.data.answer

      const activeQuestionAnswer =
        quiz.rounds[activeRound].questions[questionIndex].answer.answer_text
      if (
        removeSpaceFromAnswerString(answer) ===
        removeSpaceFromAnswerString(activeQuestionAnswer)
      ) {
        const point = pointAllocationByTimeAnswered(
          msg.data.time,
          quiz.rounds[activeRound].timer
        )

        console.log(point)

        updatePlayerScore(clientId, point, activeRound)
      }
    })

    playerChannel.subscribe('request-bonus', (msg) => {
      setGlobalGameState((prev) => {
        const updatedState = {
          ...prev,
          bonusLineup: [
            ...prev.bonusLineup,
            {
              clientId: msg.data.clientId,
              name: msg.data.name,
            },
          ],
        }
        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
    })
  }

  const updatePlayerScore = (
    playerId: string,
    point: number,
    roundIndex: number
  ) => {
    setGlobalGameState((prev) => {
      const playerName = prev.players.find(
        (player) => player.clientId === playerId
      )?.name
      const updatedRoundScores = { ...prev.leaderboard[`round-${roundIndex}`] }
      const playerScoreData = updatedRoundScores[playerId] || {
        score: 0,
        name: playerName,
      }

      playerScoreData.score += point
      updatedRoundScores[playerId] = playerScoreData

      const updatedState: GameState = {
        ...prev,
        leaderboard: {
          ...prev.leaderboard,
          [`round-${roundIndex}`]: updatedRoundScores,
        },
      }
      liveSyncWithHostDevice(updatedState)
      return updatedState
    })
  }

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
              <div className='w-36'>
                <AppLogo variant='dark' />
              </div>
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
          revealAnswer={globalGameState.revealAnswer}
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
          roomChannel={roomChannel}
          round={quiz.rounds[globalGameState.activeRound]}
          revealAnswer={globalGameState.revealAnswer}
          scores={globalGameState.leaderboard}
          seconds={seconds}
          started={globalGameState.round_started}
          ended={globalGameState.round_ended}
          isLastRound={globalGameState.activeRound === quiz.rounds.length - 1}
          bonusLineup={globalGameState.bonusLineup}
          dealingTeams={globalGameState.players}
          startTimerFunction={startQuestionCountdownTimer}
          answeredQuestions={globalGameState.answeredQuestions}
        />
      )}
    </GameInterface>
  )
}

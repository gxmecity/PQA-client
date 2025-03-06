import { PlayerGameState } from '@/app/Payer/Game'
import AppButton from '@/components/AppButton'
import AppDialog from '@/components/AppDialog'
import AppLogo from '@/components/AppLogo'
import EmptyState from '@/components/EmptyState'
import GameInterface from '@/components/GameInterface'
import useFullscreen from '@/hooks/useFullScreen'
import { ablyClient } from '@/lib/ably'
import {
  errorResponseHandler,
  initializeRoundLeaderboard,
  pointAllocationByTimeAnswered,
  removeSpaceFromAnswerString,
  splitCodeInHalf,
} from '@/lib/utils'
import { useUpdateQuizEventMutation } from '@/services/events'
import { PresenceMessage } from 'ably'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { GameEvent } from '../Broadcast'
import FinalResultComponent from './FinalResultComponent'
import Dealers from './Rounds/Dealers'
import Trivia from './Rounds/Trivia'
import WaitingArea from './WaitingArea'
import buzzer from '@/assets/Buzzer Sound Effect.wav'

interface Props {
  data: GameEvent
}

export interface TeamGameScore {
  [key: string]: {
    score: number
    name: string
    team_id?: string
  }
}

export interface RoundLeaderboard {
  [key: string]: TeamGameScore
}

export type BonusLineup = Pick<Player, 'clientId' | 'name' | 'team_id'>

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

export interface FinalResultDisplayState {
  leaderboardPositionIndex: number
  showPlayerInPosition: boolean
  showFullLeaderboard: boolean
  finalLeaderBoard: LeaderboardEntry[]
}

export default function Game({ data }: Props) {
  const {
    event_channels: { hostChannel, roomChannel },
    event_data,
    quiz,
  } = data

  const [updateQuizEvent, { isLoading: updatingEvent }] =
    useUpdateQuizEventMutation()

  const [open, setOpen] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [startingRound, setStartingRound] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [finalResultState, setFinalResultState] =
    useState<FinalResultDisplayState>({
      leaderboardPositionIndex: 5,
      showFullLeaderboard: false,
      showPlayerInPosition: false,
      finalLeaderBoard: [],
    })

  const { activateFullscreen, exitFullscreen } = useFullscreen()

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
  const [_, setplayerGameState] = useState<PlayerGameState>({
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
      activateFullscreen()
      setGlobalGameState((prev) => {
        const updatedState = { ...prev, roomOpen: msg.data.open }
        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
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
        const newRoundData: TeamGameScore = {}

        prev.players.forEach((player) => {
          newRoundData[player.clientId] = {
            name: player.name,
            score: 0,
            team_id: player.team_id,
          }
        })

        const updatedState: GameState = {
          ...prev,
          round_started: true,
          canRevealAnswer: false,
          dealer: prev.players[0],
          activeQuestionIndex: activeRound.round_type === 'trivia' ? 0 : null,
          answeredQuestions: [],
          leaderboard: {
            ...prev.leaderboard,
            [`round-${msg.data.activeRound}`]: newRoundData,
          },
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
    hostChannel.subscribe('restart-round', () => {
      setGlobalGameState((prev) => {
        const updatedState = {
          ...prev,
          activeQuestionIndex: 0,
        }
        liveSyncWithHostDevice(updatedState)

        return updatedState
      })
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
      roomChannel.publish('round-ended', { round_ended: true })
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
        msg.data.activeRound,
        msg.data.team_id
      )

      setGlobalGameState((prev) => {
        const playerToAward = prev.players.find(
          (item) => item.clientId === msg.data.playerId
        )
        if (playerToAward) {
          toast.success(
            `${msg.data.isBonus ? 'Bonus' : 'Point'} to ${playerToAward.name}`
          )
        }
        return prev
      })
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
        computeFinalLeaderboard(prev.leaderboard)
        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
    })
    hostChannel.subscribe('final-leaderboard-next', () => {
      setFinalResultState((prev) => {
        if (prev.leaderboardPositionIndex === 0 && prev.showPlayerInPosition) {
          hostChannel.publish('last-result', { isLastResult: true })
          return {
            ...prev,
            showFullLeaderboard: true,
          }
        }

        if (!prev.showPlayerInPosition)
          return {
            ...prev,
            showPlayerInPosition: true,
          }

        return {
          ...prev,
          showPlayerInPosition: false,
          leaderboardPositionIndex: prev.leaderboardPositionIndex - 1,
        }
      })
    })
    hostChannel.subscribe('end-quiz', async (msg) => {
      const leaderboard: LeaderboardEntry[] = msg.data.leaderboard.map(
        (item: LeaderboardEntry) => {
          if (!item.player.team_id)
            return {
              player: {
                id: item.player.id,
                name: item.player.name,
              },
              score: item.score,
            }

          return {
            player: {
              id: item.player.id,
              name: item.player.name,
              team_id: item.player.team_id,
            },
            score: item.score,
          }
        }
      )

      try {
        await updateQuizEvent({
          id: event_data._id,
          data: { leaderboard, event_ended: true },
        }).unwrap()
        roomChannel.publish('close-room', {})
        hostChannel.detach()
        roomChannel.detach()
        exitFullscreen()
      } catch (error: any) {
        errorResponseHandler(error)
      }
    })
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
      setGlobalGameState((prev) => {
        const updatedState: GameState = {
          ...prev,
          players: prev.players.filter(
            (item) => item.clientId !== player.data.clientId
          ),
        }
        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
      toast.success('Player left', {
        description: `${player.data.name} left the quiz.`,
      })
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
      `${event_data.entry_code}:player-${player.clientId}`
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
      const team_id = msg.data.team_id

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

        updatePlayerScore(clientId, point, activeRound, team_id)
      }
    })

    playerChannel.subscribe('request-bonus', (msg) => {
      setGlobalGameState((prev) => {
        if (
          prev.bonusLineup.some((item) => item.clientId === msg.data.clientId)
        )
          return prev

        const updatedState: GameState = {
          ...prev,
          bonusLineup: [
            ...prev.bonusLineup,
            {
              clientId: msg.data.clientId,
              name: msg.data.name,
              team_id: msg.data.team_id,
            },
          ],
        }
        playSound()
        liveSyncWithHostDevice(updatedState)
        return updatedState
      })
    })
  }

  const updatePlayerScore = (
    playerId: string,
    point: number,
    roundIndex: number,
    team_id?: string
  ) => {
    setGlobalGameState((prev) => {
      const playerName = prev.players.find(
        (player) => player.clientId === playerId
      )?.name
      const updatedRoundScores = { ...prev.leaderboard[`round-${roundIndex}`] }
      const playerScoreData = updatedRoundScores[playerId] || {
        score: 0,
        name: playerName,
        team_id: team_id ?? '',
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

  const computeFinalLeaderboard = (scores: RoundLeaderboard) => {
    const finalScores: { [key: string]: LeaderboardEntry } = {}

    // Aggregate scores across rounds
    for (const round in scores) {
      for (const playerId in scores[round]) {
        const player = scores[round][playerId]
        if (!finalScores[playerId]) {
          finalScores[playerId] = {
            player: {
              name: player.name,
              id: playerId,
              team_id: player.team_id,
            },
            score: 0,
          }
        }
        finalScores[playerId].score += player.score
      }
    }

    // Convert aggregated scores into leaderboard array
    const leaderboard: LeaderboardEntry[] = Object.values(finalScores)

    // Sort by score in descending order
    leaderboard.sort((a, b) => b.score - a.score)

    setFinalResultState((prev) => ({
      ...prev,
      leaderboardPositionIndex:
        leaderboard.length > 6 ? 5 : leaderboard.length - 1,
      finalLeaderBoard: leaderboard,
    }))

    roomChannel.publish('end-quiz', { quiz_ended: true, leaderboard })
  }

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play()
    }
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
              Go to{' '}
              <span className=' underline'>
                {window.location.hostname}/host
              </span>{' '}
              and enter this host code to remotely control your quiz.
            </small>
            <div className=' flex items-center justify-between gap-5 w-full'>
              <span className=' h-[0.5px] bg-primary flex-auto'></span>
            </div>
            <AppButton
              text='Start Game '
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
      {updatingEvent ? (
        <EmptyState
          icon={
            <span className=' w-28 block animate-pulse'>
              <AppLogo variant='white' />
            </span>
          }
          title='Submitting Result'
          description='Please wait while we submit the results and close the room...'
        />
      ) : (
        <>
          {globalGameState.quiz_ended ? (
            <FinalResultComponent
              resultState={finalResultState}
              hostChannel={hostChannel}
            />
          ) : !globalGameState.quiz_started ? (
            <WaitingArea
              joinedPlayers={globalGameState.players}
              title={event_data.title}
              startQuiz={() => {
                hostChannel.publish('start-quiz', {})
              }}
            />
          ) : quiz.rounds[globalGameState.activeRound].round_type ===
            'trivia' ? (
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
              isLastRound={
                globalGameState.activeRound === quiz.rounds.length - 1
              }
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
              isLastRound={
                globalGameState.activeRound === quiz.rounds.length - 1
              }
              bonusLineup={globalGameState.bonusLineup}
              dealingTeams={globalGameState.players}
              startTimerFunction={startQuestionCountdownTimer}
              answeredQuestions={globalGameState.answeredQuestions}
            />
          )}
          <audio ref={audioRef} src={buzzer} />
        </>
      )}
    </GameInterface>
  )
}

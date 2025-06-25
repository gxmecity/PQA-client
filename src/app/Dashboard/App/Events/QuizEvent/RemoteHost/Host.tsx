import Login from '@/app/Host/Login'
import { ablyClient } from '@/lib/ably'
import { gameActions } from '@/redux/game'
import { useAppDisPatch, useAppSelector } from '@/redux/store'
import { useCallback, useEffect, useState } from 'react'
import GameRound from './GameRound'
import WaitingArea from './WaitingArea'
import QuizEnded from './QuizEnded'

function Host({
  roomCode,
  creator,
  gameMode,
}: {
  roomCode: string
  creator: string
  gameMode: string
}) {
  const clientId = ablyClient.auth.clientId

  const hostChannel = ablyClient.channels.get(`${roomCode}:host`)
  const roomChannel = ablyClient.channels.get(`${roomCode}:primary`)

  const [timer, setTimer] = useState(0)
  const [questionTimer, setQuestionTimer] = useState(0)
  const [roomOpen, setRoomOpen] = useState(false)

  const { quiz_started, quiz_ended, totalPlayers } = useAppSelector(
    (state) => state.game
  )
  const { user } = useAppSelector((state) => state.auth)

  const dispatch = useAppDisPatch()

  const handleMessage = useCallback(
    (msg: any) => {
      const { name, data } = msg

      switch (name) {
        case 'new-player':
          dispatch(gameActions.addNewPlayerToState(data.player))
          break
        case 'exiting-player':
          dispatch(gameActions.updateExitingPlayerState(data.playerId))
          break
        case 'quiz-started':
          dispatch(
            gameActions.updateGameState({
              quiz_started: true,
              round: data.round,
              canRevealAnswer: data.canRevealAnswer,
            })
          )
          break
        case 'new-round':
          dispatch(
            gameActions.updateGameState({
              round: data.round,
              question: null,
              canRevealAnswer: data.canRevealAnswer,
              answeredQuestions: [],
              dealer_index: data.dealer_index || 0,
            })
          )
          break
        case 'start-round':
          dispatch(gameActions.updateGameRound({ round_started: true }))
          break
        case 'countdown-timer':
          setTimer(data.timer)
          break
        case 'question-timer':
          setQuestionTimer(data.timer)
          break
        case 'new-question':
          dispatch(
            gameActions.updateGameState({
              question: data.question,
              isRevealAnswer: false,
              answeredQuestions: data.answeredQuestions,
              bonusLineUp: [],
              ...(data.dealer_index !== undefined && {
                dealer_index: data.dealer_index,
              }),
            })
          )
          break
        case 'answer-reveal':
          dispatch(gameActions.updateGameState({ canRevealAnswer: true }))
          break
        case 'show-answer':
          dispatch(gameActions.updateGameState({ isRevealAnswer: true }))
          break
        case 'bonus-request':
          dispatch(gameActions.addToBonusLineUp(data.player))
          break
        case 'quiz-ended':
          dispatch(gameActions.updateGameState({ quiz_ended: true }))
          cleanupChannels()
          break
        default:
          console.warn('Unhandled event:', name)
      }
    },
    [dispatch]
  )

  const subscribeToRoomChannel = useCallback(() => {
    const eventNames = [
      'quiz-started',
      'new-remote-device',
      'exiting-remote-device',
      'new-round',
      'start-round',
      'countdown-timer',
      'question-timer',
      'new-question',
      'answer-reveal',
      'new-player',
      'exiting-player',
      'show-answer',
      'quiz-ended',
    ]

    eventNames.forEach((event) => {
      roomChannel.subscribe(event, (msg) =>
        handleMessage({ name: event, data: msg.data })
      )
    })

    hostChannel.subscribe('open-room', () => {
      setRoomOpen(true)
    })

    hostChannel.subscribe('sync-state', (msg) => {
      console.log(msg.data)
      if (msg.data.clientId === clientId) {
        setRoomOpen(true)
        dispatch(gameActions.updateGameState({ ...msg.data.state }))
      }
    })

    return () => {
      eventNames.forEach((event) => roomChannel.unsubscribe(event))
      hostChannel.unsubscribe('open-room')
    }
  }, [roomChannel, hostChannel, handleMessage])

  const cleanupChannels = useCallback(() => {
    try {
      roomChannel.detach()
      hostChannel.detach()
    } catch (err) {
      console.error('Error detaching channels:', err)
    }
  }, [roomChannel, hostChannel])

  useEffect(() => {
    if (user && user._id === creator) {
      subscribeToRoomChannel()
      hostChannel.presence.enter()
    }
  }, [user])

  if (!user) return <Login />

  if (user._id !== creator) return <div>Not Authorized</div>

  if (quiz_ended) return <QuizEnded />

  if (!quiz_started)
    return (
      <WaitingArea
        roomCode={roomCode}
        roomOpen={roomOpen}
        totalPlayers={totalPlayers.length}
        startQuiz={() => {
          hostChannel.publish('start-quiz', {})
        }}
        user={user}
      />
    )

  return (
    <GameRound
      timer={timer}
      questionTimer={questionTimer}
      hostChannel={hostChannel}
      gameMode={gameMode}
    />
  )
}

export default Host

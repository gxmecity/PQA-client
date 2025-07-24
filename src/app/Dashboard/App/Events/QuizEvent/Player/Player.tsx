import { ablyClient } from '@/lib/ably'
import { playerGameActions, playerSlice } from '@/redux/player'
import { useAppDisPatch, useAppSelector } from '@/redux/store'
import { RealtimeChannel } from 'ably'
import { useCallback, useEffect, useState } from 'react'
import GameRound from './GameRound'
import PlayerDetails from './PlayerDetails'
import WaitingArea from './WaitingArea'
import QuizEnded from '../RemoteHost/QuizEnded'

function Player({
  roomCode,
}: {
  roomCode: string
  creator: string
  gameMode: string
}) {
  const { player, quiz_ended, quiz_started } = useAppSelector(
    (state) => state.player
  )
  const dispatch = useAppDisPatch()
  const [playerChannel, setPlayerChannel] = useState<RealtimeChannel>()

  const clientId = ablyClient.auth.clientId

  const roomChannel = ablyClient.channels.get(`${roomCode}:primary`)

  const [timer, setTimer] = useState(0)
  const [questionTimer, setQuestionTimer] = useState(0)

  const handleMessage = useCallback((msg: any) => {
    const { name, data } = msg

    switch (name) {
      case 'quiz-started':
        dispatch(
          playerGameActions.updateGameState({
            quiz_started: true,
            round: data.round,
          })
        )
        break
      case 'new-round':
        dispatch(
          playerGameActions.updateGameState({
            round: data.round,
            question: null,
          })
        )
        break
      case 'start-round':
        dispatch(playerGameActions.updateGameRound({ round_started: true }))
        break
      case 'countdown-timer':
        setTimer(data.timer)
        break
      case 'question-timer':
        setQuestionTimer(data.timer)
        break
      case 'new-question':
        dispatch(
          playerGameActions.updateGameState({
            question: data.question.question.question,
            buzzer: false,
          })
        )
        break
      case 'allow-buzzer':
        dispatch(playerGameActions.updateGameState({ buzzer: true }))
        break
      case 'quiz-ended':
        dispatch(playerSlice.actions.updateGameState({ quiz_ended: true }))
        break
      case 'sync-state':
        dispatch(playerSlice.actions.updateGameState(data.state))
        break

      default:
        console.warn('Unhandled event', name)
    }
  }, [])

  const subscribeToQuizChannel = useCallback(() => {
    const eventNames = [
      'quiz-started',
      'new-round',
      'start-round',
      'countdown-timer',
      'question-timer',
      'new-question',
      'answer-reveal',
      'allow-buzzer',
      'quiz-ended',
    ]

    eventNames.forEach((event) => {
      roomChannel.subscribe(event, (msg) =>
        handleMessage({ name: event, data: msg.data })
      )
    })

    return () => {
      eventNames.forEach((event) => roomChannel.unsubscribe(event))
    }
  }, [roomChannel, handleMessage])

  useEffect(() => {
    if (!player) return

    if (!playerChannel) {
      const channel = ablyClient.channels.get(
        `${roomCode}:player-ch-${clientId}`
      )

      setPlayerChannel(channel)

      channel.subscribe('sync-state', (msg) => {
        handleMessage({ name: 'sync-state', data: msg.data })
      })
    }

    subscribeToQuizChannel()
    roomChannel.presence.enter(player)
  }, [player])

  if (!player) return <PlayerDetails playerId={clientId} roomCode={roomCode} />

  if (quiz_ended) return <QuizEnded />

  if (!quiz_started) return <WaitingArea player={player} />

  return (
    <GameRound
      playerChannel={playerChannel!}
      timer={timer}
      questionTimer={questionTimer}
    />
  )
}

export default Player

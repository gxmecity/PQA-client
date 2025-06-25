import { ablyClient } from '@/lib/ably'
import { playerSlice } from '@/redux/player'
import { useAppSelector } from '@/redux/store'
import { RealtimeChannel } from 'ably'
import { useCallback, useState } from 'react'
import GameRound from './GameRound'

function Player() {
  const { player, round, question, quiz_ended, quiz_started } = useAppSelector(
    (state) => state.player
  )
  const clientId = ablyClient.auth.clientId

  const roomChannel = ablyClient.channels.get('')
  let playerChannel: RealtimeChannel

  const [timer, setTimer] = useState(0)
  const [questionTimer, setQuestionTimer] = useState(0)

  const handleRoomMessage = useCallback((msg: any) => {
    const { name, data } = msg

    switch (name) {
      case 'quiz-started':
        playerSlice.actions.updateGameState({
          quiz_started: true,
          round: data.round,
        })
        break
      case 'new-round':
        playerSlice.actions.updateGameState({
          round: data.round,
          question: null,
        })
        break
      case 'start-round':
        playerSlice.actions.updateGameRound({ round_started: true })
        break
      case 'countdown-timer':
        setTimer(data.timer)
        break
      case 'question-timer':
        setQuestionTimer(data.timer)
        break
      case 'new-question':
        playerSlice.actions.updateGameState({
          question: data.question.question.question,
          buzzer: false,
        })
        break
      case 'allow-buzzer':
        playerSlice.actions.updateGameState({ buzzer: true })
        break

      default:
        console.warn('Unnhandled event', name)
    }
  }, [])

  if (!player) return <div>Player details</div>

  if (quiz_ended) return <div>Quiz Ended</div>

  if (!quiz_started) return <div>Waitin for start</div>

  return <GameRound />
}

export default Player

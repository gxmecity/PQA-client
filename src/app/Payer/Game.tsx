import { ablyClient } from '@/lib/ably'
import { useEffect, useState } from 'react'
import Dealers from './Dealers'
import { QuizPlayer } from './Player'
import RoundIntro from './RoundIntro'
import Trivia from './Trivia'

interface Props {
  data: QuizEvent
  user: QuizPlayer
}

export interface PlayerRound {
  title: string
  type: string
  time: number
  index: number
  round_started: boolean
  round_ended: boolean
}

export interface PlayerGameState {
  quiz_started: boolean
  quiz_ended: boolean
  round: PlayerRound | null
  question: Question | null
  questionIndex: number
}

export default function Game({ data, user }: Props) {
  const playerId = user.clientId ?? ablyClient.auth.clientId

  const [seconds, setSeconds] = useState<number>(0)
  const [startingRound, setstartingRound] = useState<boolean>(false)

  const [gameState, setGameState] = useState<PlayerGameState>({
    question: null,
    round: null,
    quiz_started: false,
    quiz_ended: false,
    questionIndex: 0,
  })
  const [allowBonus, setAllowBonus] = useState(false)

  const roomChannel = ablyClient.channels.get(`${data.entry_code}:primary`)
  const playerChannel = ablyClient.channels.get(
    `${data.entry_code}:player-${playerId}`
  )

  const subscribeToRoomChannels = () => {
    playerChannel.subscribe('sync-state', (msg) => {
      setGameState(msg.data.gameState)
      console.log('state sync', msg.data)
    })
    roomChannel.subscribe('start-quiz', (msg) => {
      setGameState((prev) => ({
        ...prev,
        ...msg.data,
      }))
    })
    roomChannel.subscribe('start-round', (msg) => {
      setGameState((prev) => ({
        ...prev,
        round: {
          ...prev.round!,
          round_started: msg.data.round_started,
        },
      }))
    })
    roomChannel.subscribe('start-round-timer', (msg) => {
      setSeconds(msg.data.countDownSec)
      setstartingRound(true)
    })
    roomChannel.subscribe('question-timer', (msg) => {
      setSeconds(msg.data.countDownSec)
    })
    roomChannel.subscribe('timer-ended', () => {
      setstartingRound(false)
    })
    roomChannel.subscribe('new-question', (msg) => {
      setGameState((prev) => ({
        ...prev,
        question: msg.data.question,
        questionIndex: msg.data.index,
      }))
      setstartingRound(false)
    })
    roomChannel.subscribe('allow-bonus', (msg) => {
      setAllowBonus(msg.data.allowBonus)
    })
    roomChannel.subscribe('round-ended', (msg) => {
      setGameState((prev) => ({
        ...prev,
        round: {
          ...prev.round!,
          round_ended: msg.data.round_ended,
        },
      }))
    })
    roomChannel.subscribe('next-round', (msg) => {
      setGameState((prev) => ({
        ...prev,
        round: msg.data.round,
        question: null,
        questionIndex: 0,
      }))
    })
  }

  useEffect(() => {
    const playerData = {
      clientId: playerId,
      avatar_url: user.avatar,
      team_id: user.team_id,
      name: user.name,
    }

    roomChannel.presence.enter(playerData)
    subscribeToRoomChannels()

    localStorage.setItem(
      'pqa_player_game_data',
      JSON.stringify({
        player: playerData,
        event: data.entry_code,
      })
    )
  }, [])

  const submitAnswer = async (answer: string) => {
    if (!gameState.round) return
    await playerChannel.publish('submit-answer', {
      clientId: playerId,
      activeRound: gameState.round.index,
      activeQuestion: gameState.questionIndex,
      answer,
      time: seconds,
    })
  }

  const requestBonus = async () => {
    await playerChannel.publish('request-bonus', {
      name: user.name,
      clientId: playerId,
    })
    setAllowBonus(false)
  }

  if (gameState.quiz_ended)
    return (
      <div className=' flex-auto flex items-center flex-col'>
        <p className='font-bold'>Quiz Ended</p>
        <h1>Thanks For Playing.</h1>
        <small className=' text-muted-foreground'>
          Check the main screen to see your final score..
        </small>
      </div>
    )

  if (!gameState.quiz_started)
    return (
      <div className=' flex-auto flex items-center flex-col justify-center animate-pulse'>
        <p>Waiting for quiz to start</p>
        <small className=' text-muted-foreground'>
          The quiz master has not started the quiz yet. please wait...
        </small>
      </div>
    )

  if (!gameState.round || gameState.round.round_ended)
    return (
      <div className=' flex-auto flex items-center flex-col justify-center animate-pulse'>
        <p>Waiting for next round</p>
        <small className=' text-muted-foreground'>
          The quiz master has not started the next round. please wait...
        </small>
      </div>
    )

  if (startingRound)
    return (
      <div className='h-full flex items-center justify-center flex-col gap-10 '>
        <p className='font-semibold text-xl'>Round is starting in</p>
        <h1 className='font-bold text-7xl text-primary'>{seconds}</h1>
        <p className='font-medium text-lg'>Answer faster to gain more points</p>
      </div>
    )

  if (!gameState.round.round_started)
    return <RoundIntro round={gameState.round} />

  if (!gameState.question)
    return (
      <div className=' flex-auto flex items-center flex-col justify-center animate-pulse'>
        <p>Waiting for next question</p>
        <small className=' text-muted-foreground'>
          The quiz master has not sent your next question. please wait...
        </small>
      </div>
    )

  if (gameState.round.round_ended)
    return (
      <div className=' flex-auto flex items-center justify-center flex-col'>
        <p className='font-bold'>Round Ended</p>
        <small className=' text-muted-foreground'>
          Check the main screen to see your final score..
        </small>
      </div>
    )

  return (
    <div className=' flex-auto overflow-auto'>
      {gameState.round.type === 'trivia' ? (
        <Trivia
          round={gameState.round}
          question={gameState.question}
          seconds={seconds}
          submitAnswer={submitAnswer}
        />
      ) : (
        <Dealers
          round={gameState.round}
          seconds={seconds}
          requestBonus={requestBonus}
          allowBonus={allowBonus}
        />
      )}
    </div>
  )
}

import GameInterface from '@/components/GameInterface'
import { quizzes } from '@/data'
import { useState } from 'react'
import Round from './Round'
import WaitingArea from './WaitingArea'

export default function Game() {
  const [gameStarted, setGameStarted] = useState(false)

  if (!gameStarted)
    return (
      <WaitingArea quiz={quizzes[0]} startQuiz={() => setGameStarted(true)} />
    )

  return (
    <GameInterface>
      <Round />
    </GameInterface>
  )
}

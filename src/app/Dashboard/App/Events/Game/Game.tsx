import React, { useState } from 'react'
import WaitingArea from './WaitingArea'
import { quizzes } from '@/data'
import Round from './Round'
import GameInterface from '@/components/GameInterface'

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

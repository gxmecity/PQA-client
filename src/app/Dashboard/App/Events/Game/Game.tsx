import GameInterface from '@/components/GameInterface'
import { quizzes } from '@/data'
import { useState } from 'react'
import Round from './Round'
import WaitingArea from './WaitingArea'

export default function Game() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)

  if (gameEnded)
    return (
      <GameInterface>
        <>Quiz Ended</>
      </GameInterface>
    )

  if (!gameStarted)
    return (
      <WaitingArea quiz={quizzes[0]} startQuiz={() => setGameStarted(true)} />
    )

  return (
    <GameInterface>
      <Round onQuizEnded={() => setGameEnded(true)} />
    </GameInterface>
  )
}

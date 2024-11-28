import { useState } from 'react'
import Leaderboard, { LeaderboardEntry } from './Leaderboard'
import { RoundLeaderboard } from './Game'

function FinalResultComponent({ scores }: { scores: RoundLeaderboard }) {
  // const [showLeaderbord, setshowLeaderbord] = useState(false)

  const computeFinalLeaderboard = (): LeaderboardEntry[] => {
    const finalScores: { [key: string]: { name: string; score: number } } = {}

    // Aggregate scores across rounds
    for (const round in scores) {
      for (const playerId in scores[round]) {
        const player = scores[round][playerId]
        if (!finalScores[playerId]) {
          finalScores[playerId] = { name: player.name, score: 0 }
        }
        finalScores[playerId].score += player.score
      }
    }

    // Convert aggregated scores into leaderboard array
    const leaderboard: LeaderboardEntry[] = Object.values(finalScores)

    // Sort by score in descending order
    leaderboard.sort((a, b) => b.score - a.score)

    return leaderboard
  }

  return (
    <>
      <div className=' h-full mx-auto max-w-4xl flex flex-col gap-5'>
        <div className=' flex items-center justify-between gap-10'>
          <span className=' h-[2px] bg-black flex-auto'></span>
          <h1 className=' text-2xl font-semibold'>Standings - All Rounds</h1>
          <span className=' h-[2px] bg-black flex-auto'></span>
        </div>
        <Leaderboard scores={computeFinalLeaderboard()} />
      </div>
      <button className='absolute bottom-5 lef-1/2 -translate-x-1/2 bg-muted/40 text-white px-2 rounded-md py-2 text-sm animate-pulse'>
        Press{' '}
        <span className='bg-muted/60 font-medium p-1 rounded-sm'>Enter</span> to
        End Quiz
      </button>
    </>
  )
}

export default FinalResultComponent

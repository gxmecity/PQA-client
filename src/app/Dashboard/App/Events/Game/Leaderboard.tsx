import LeaderboardItem from '@/components/LeaderboardItem'
import React from 'react'

interface Props {
  scores: { name: string; score: number; id: string }[]
}

export default function Leaderboard({ scores }: Props) {
  return (
    <div className=' flex-auto overflow-auto flex flex-col gap-4 px-4'>
      {Array.from({ length: 6 }).map((_, index) => (
        <LeaderboardItem key={index} index={index + 1} />
      ))}
    </div>
  )
}

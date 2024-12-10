import LeaderboardItem from '@/components/LeaderboardItem'

export type LeaderboardItem = { name: string; score: number }
interface Props {
  scores: LeaderboardEntry[]
}

export default function Leaderboard({ scores }: Props) {
  return (
    <div className=' flex-auto overflow-auto flex flex-col gap-4 px-4'>
      {scores.map((player, index) => (
        <LeaderboardItem
          key={index}
          index={index + 1}
          name={player.player.name}
          score={player.score}
        />
      ))}
    </div>
  )
}

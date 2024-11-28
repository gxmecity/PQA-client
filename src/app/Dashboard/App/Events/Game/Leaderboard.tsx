import LeaderboardItem from '@/components/LeaderboardItem'

interface Props {
  scores: { name: string; score: number }[]
}

export default function Leaderboard({ scores }: Props) {
  return (
    <div className=' flex-auto overflow-auto flex flex-col gap-4 px-4'>
      {scores.map((player, index) => (
        <LeaderboardItem
          key={index}
          index={index + 1}
          name={player.name}
          score={player.score}
        />
      ))}
    </div>
  )
}

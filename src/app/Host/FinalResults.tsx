import AppButton from '@/components/AppButton'
import { computeFinalLeaderboard } from '@/lib/utils'
import { RealtimeChannel } from 'ably'
import { RoundLeaderboard } from '../Dashboard/App/Events/Game/Game'

interface Props {
  scores: RoundLeaderboard
  hostChannel: RealtimeChannel
  lastResult: boolean
}

export default function FinalResults({
  scores,
  hostChannel,
  lastResult,
}: Props) {
  const finalLeaderBoard: LeaderboardEntry[] = computeFinalLeaderboard(scores)

  const handleNextStep = () => {
    if (lastResult) {
      hostChannel.publish('end-quiz', { leaderboard: finalLeaderBoard })
    } else {
      hostChannel.publish('final-leaderboard-next', {})
    }
  }

  return (
    <section className=' h-full overflow-auto px-5 py-5 w-full max-w-5xl'>
      <h1 className=' text-primary text-3xl font-bold text-center'>
        Quiz Ended
      </h1>

      <div className=' my-10 text-muted-foreground'>
        <p></p>
      </div>
      <AppButton
        text={lastResult ? 'Save Result & Close Room' : 'Reveal Next'}
        classname=' h-12 mb-8 font-bold w-full max-w-[200px] text-primary border-primary'
        onClick={handleNextStep}
        variant='outline'
      />

      <div>
        <h3 className='text-xl font-semibold'>Standings</h3>
        <div className=' mt-5'>
          {finalLeaderBoard.map((player, index) => (
            <div
              key={index}
              className=' flex items-center gap-5 h-14  px-2 border border-border'>
              <span>{index + 1}</span>
              <span className=' flex-auto flex items-center pl-2 truncate border-x border-x-border h-full'>
                {player.player.name}
              </span>
              <span className=' ml-auto'>{player.score}pts</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import CircularProgress from '@/components/CircularProgress'
import { cn } from '@/lib/utils'
import { Hand } from 'lucide-react'
import { RealtimeChannel } from 'ably'
import { PlayerRound } from './Game'

interface Props {
  seconds: number
  allowBonus: boolean
  requestBonus: () => void
  round: PlayerRound
}

export default function Dealers({
  allowBonus,
  seconds,
  requestBonus,
  round,
}: Props) {
  return (
    <div className=' h-full flex flex-col items-center justify-around'>
      <div className=' text-center'>
        <p>Look at the main screen to see the question.</p>
        <small className='text-muted-foreground'>
          Dealer's choice rounds are answered from the main screen. Only use
          your device to request bonus.
        </small>
      </div>
      <div className=' rounded-full'>
        <button
          className={cn(
            ' h-44 w-44  bg-primary flex items-center justify-center rounded-full disabled:bg-muted disabled:text-muted-foreground',
            allowBonus && 'pulsate-bck'
          )}
          onClick={requestBonus}
          disabled={!allowBonus}>
          <Hand size={70} />
        </button>
        <p className=' text-center mt-5'>Request Bonus</p>
      </div>
      {seconds > 0 && (
        <CircularProgress
          value={seconds}
          total={round.time}
          color='#ffce1f'
          sizeClassname=' size-24 text-xl'
        />
      )}
    </div>
  )
}

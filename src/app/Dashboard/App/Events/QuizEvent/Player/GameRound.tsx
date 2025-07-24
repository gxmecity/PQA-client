import EmptyState from '@/components/EmptyState'
import { cn } from '@/lib/utils'
import { playerGameActions } from '@/redux/player'
import { useAppDisPatch, useAppSelector } from '@/redux/store'
import { RealtimeChannel } from 'ably'
import { Hand } from 'lucide-react'

interface Props {
  playerChannel: RealtimeChannel
  timer: number
  questionTimer: number
}

function GameRound({ playerChannel }: Props) {
  const { round, question, buzzer } = useAppSelector((state) => state.player)
  const dispatch = useAppDisPatch()

  const requestBonus = async () => {
    await playerChannel.publish('request-bonus', {})

    dispatch(playerGameActions.updateGameState({ buzzer: false }))
  }

  if (!round)
    return (
      <div className='h-full animate-pulse'>
        <EmptyState
          title='Waiting for Next Round....'
          description='Hold on while we fetch the next round...'
        />
      </div>
    )

  if (!round.round_started)
    return (
      <div className='h-full animate-pulse'>
        <EmptyState
          title={round.title}
          description='Waiting for round to start...'
        />
      </div>
    )

  if (!question)
    return (
      <div className='h-full animate-pulse'>
        <EmptyState
          title='Waiting for Next Question....'
          description='Hold on while we fetch the next question...'
        />
      </div>
    )

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
            buzzer && 'pulsate-bck'
          )}
          onClick={requestBonus}
          disabled={!buzzer}>
          <Hand size={70} />
        </button>
        <p className=' text-center mt-5'>Request Bonus</p>
      </div>
    </div>
  )
}

export default GameRound

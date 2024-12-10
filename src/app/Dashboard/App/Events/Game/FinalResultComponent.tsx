import AppButton from '@/components/AppButton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { nthNumber } from '@/lib/utils'
import { RealtimeChannel } from 'ably'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import { FinalResultDisplayState } from './Game'
import Leaderboard from './Leaderboard'

function FinalResultComponent({
  resultState,
  hostChannel,
}: {
  resultState: FinalResultDisplayState
  hostChannel: RealtimeChannel
}) {
  const {
    leaderboardPositionIndex,
    showFullLeaderboard,
    showPlayerInPosition,
    finalLeaderBoard,
  } = resultState

  const activeIndex = leaderboardPositionIndex + 1
  const activeScoreItem = finalLeaderBoard[leaderboardPositionIndex]

  const revealNext = () => {
    hostChannel.publish('final-leaderboard-next', {})
  }

  const endQuizAndCloseRoom = () => {
    hostChannel.publish('end-quiz', { leaderboard: finalLeaderBoard })
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      revealNext()
    }
  }

  const triggerConfettiCanon = () => {
    const end = Date.now() + 10 * 1000 // 3 seconds
    const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']

    const frame = () => {
      if (Date.now() > end) return

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      })

      requestAnimationFrame(frame)
    }

    frame()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  useEffect(() => {
    if (
      leaderboardPositionIndex === 0 &&
      showPlayerInPosition &&
      !showFullLeaderboard
    )
      triggerConfettiCanon()
  }, [leaderboardPositionIndex, showPlayerInPosition])

  if (!showFullLeaderboard)
    return (
      <>
        <div className=' h-full mx-auto max-w-4xl flex flex-col gap-40'>
          <div className=' h-56 bg-black/80 flex items-center justify-center '>
            <p className='gd-text-primary text-5xl font-bold'>
              In {activeIndex}
              {nthNumber(activeIndex)} Position with {activeScoreItem.score}pts
              is...
            </p>
          </div>
          {showPlayerInPosition && (
            <div className=' flex flex-col items-center gap-10'>
              <Avatar className='w-60 h-60'>
                <AvatarFallback className=' bg-black text-primary text-7xl font-bold'>
                  {activeScoreItem.player.name
                    .split(' ')
                    .slice(0, 3)
                    .map((word) => word.slice(0, 1))}
                </AvatarFallback>
              </Avatar>
              <h1 className=' font-bold text-5xl'>
                {activeScoreItem.player.name}
              </h1>
            </div>
          )}
        </div>
        <button
          onClick={revealNext}
          className='absolute bottom-5 lef-1/2 -translate-x-1/2 bg-muted/40 text-white px-2 rounded-md py-2 text-sm animate-pulse'>
          Press{' '}
          <span className='bg-muted/60 font-medium p-1 rounded-sm'>Enter</span>{' '}
          to reveal next
        </button>
      </>
    )

  return (
    <div className=' h-full mx-auto max-w-4xl flex flex-col gap-5'>
      <div className=' flex items-center justify-between gap-10'>
        <span className=' h-[2px] bg-black flex-auto'></span>
        <h1 className=' text-2xl font-semibold'>Standings - All Rounds</h1>
        <span className=' h-[2px] bg-black flex-auto'></span>
      </div>
      <h1 className=' text-3xl font-bold'>
        Congratulations {finalLeaderBoard[0].player.team_id && <>Team</>}{' '}
        {finalLeaderBoard[0].player.name}
      </h1>
      <Leaderboard scores={finalLeaderBoard} />
      <AppButton
        onClick={endQuizAndCloseRoom}
        text='Close Room and Save Event'
        classname='h-12 bg-black text-primary hover:bg-black font-bold w-max px-4 text-lg mx-auto'
      />
    </div>
  )
}

export default FinalResultComponent

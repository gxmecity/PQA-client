import { Button } from '@/components/ui/button'
import useFullscreen from '@/hooks/useFullScreen'
import { useAppSelector } from '@/redux/store'
import {
  CaretRightIcon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  PlayIcon,
  ReloadIcon,
} from '@radix-ui/react-icons'
import { RealtimeChannel } from 'ably'
import { CircleX } from 'lucide-react'
import { useMemo } from 'react'

interface Props {
  hostChannel: RealtimeChannel
}

function GameControlPanel({ hostChannel }: Props) {
  const { isFullscreen, exitFullscreen, activateFullscreen } = useFullscreen()
  const gameState = useAppSelector((state) => state.game)

  const isTrivia = gameState.round?.type === 'trivia'
  const canEndRound = isTrivia ? gameState.question?.isLast : true

  const handlePublish = (event: string, data: Record<string, any> = {}) =>
    hostChannel.publish(event, data)

  const controls = useMemo(() => {
    if (!gameState.quiz_started) {
      return (
        <Button
          className='py-0 h-max text-xs bg-transparent'
          variant='ghost'
          onClick={() => handlePublish('start-quiz')}>
          Start Quiz
        </Button>
      )
    }

    if (!gameState.round) return null

    const { round_started, round_ended, isLastRound } = gameState.round

    return (
      <>
        {!round_started && (
          <Button
            onClick={() => handlePublish('start-round')}
            className='py-0 h-max text-xs bg-transparent'
            variant='ghost'>
            <PlayIcon /> Start Round
          </Button>
        )}

        {round_started && (
          <Button
            onClick={() => handlePublish('end-round')}
            disabled={!canEndRound || round_ended}
            className='py-0 h-max text-xs bg-transparent'
            variant='ghost'>
            <CircleX /> End Round
          </Button>
        )}

        {round_started && isTrivia && (
          <Button
            onClick={() => handlePublish('restart-round')}
            className='py-0 h-max text-xs bg-transparent'
            variant='ghost'>
            <ReloadIcon /> Restart Round
          </Button>
        )}

        {(!round_started || round_ended) && !isLastRound && (
          <Button
            onClick={() => handlePublish('next-round')}
            className='py-0 h-max text-xs bg-transparent'
            variant='ghost'>
            <span className='border-r border-r-game-foreground'>
              <PlayIcon />
            </span>{' '}
            Next Round
          </Button>
        )}

        {gameState.question && (
          <>
            <Button
              onClick={() =>
                isTrivia
                  ? handlePublish('next-question')
                  : handlePublish('set-question-index', { index: null })
              }
              disabled={gameState.question.isLast && isTrivia}
              className='py-0 h-max text-xs bg-transparent'
              variant='ghost'>
              <CaretRightIcon /> Next Question
            </Button>
            {gameState.question.isLast &&
              isTrivia &&
              !gameState.canRevealAnswer && (
                <Button
                  onClick={() => handlePublish('start-answer-reveal')}
                  className='py-0 h-max text-xs bg-transparent'
                  variant='ghost'>
                  Start Answer Reveal
                </Button>
              )}
            <Button
              disabled={
                !gameState.canRevealAnswer ||
                gameState.isRevealAnswer ||
                gameState.question.question.question.question_type ===
                  'question_only'
              }
              onClick={() => handlePublish('reveal-answer')}
              className='py-0 h-max text-xs bg-transparent'
              variant='ghost'>
              Reveal Answer
            </Button>
          </>
        )}
      </>
    )
  }, [gameState, canEndRound, handlePublish, isTrivia])

  return (
    <div className='h-8 bg-game-background px-4 py-1 flex items-center gap-5 text-sm justify-between'>
      <div className='flex items-center gap-2'>{controls}</div>

      <div className='flex items-center gap-2'>
        <Button
          onClick={() => handlePublish('end-quiz')}
          className='py-0 h-max text-xs bg-transparent'
          variant='ghost'>
          End Quiz & Exit
        </Button>

        {isFullscreen ? (
          <Button
            onClick={exitFullscreen}
            className='py-0 h-max text-xs bg-transparent'
            variant='ghost'>
            <ExitFullScreenIcon />
          </Button>
        ) : (
          <Button
            onClick={activateFullscreen}
            className='py-0 h-max text-xs bg-transparent'
            variant='ghost'>
            <EnterFullScreenIcon />
          </Button>
        )}
      </div>
    </div>
  )
}

export default GameControlPanel

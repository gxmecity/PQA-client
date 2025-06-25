import AppButton from '@/components/AppButton'
import AppDialog from '@/components/AppDialog'
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
import { BellDot, CircleX, UserCircle } from 'lucide-react'
import { useMemo, useState } from 'react'

interface Props {
  hostChannel: RealtimeChannel
  timer: number
}

function GameControlPanel({ hostChannel, timer }: Props) {
  const { isFullscreen, exitFullscreen, activateFullscreen } = useFullscreen()
  const gameState = useAppSelector((state) => state.game)
  const [openNotifyNoPlayerJoined, setOpenNotifyNoPlayerJoined] =
    useState(false)

  const isTrivia = gameState.round?.type === 'trivia'
  const canEndRound = isTrivia ? gameState.question?.isLast : true

  const handlePublish = (event: string, data: Record<string, any> = {}) =>
    hostChannel.publish(event, data)

  const controls = useMemo(() => {
    if (!gameState.quiz_started) {
      return (
        <>
          <Button
            className='py-0 h-max text-xs bg-transparent'
            variant='ghost'
            onClick={() =>
              gameState.totalPlayers.length < 1
                ? setOpenNotifyNoPlayerJoined(true)
                : handlePublish('start-quiz')
            }>
            Start Quiz
          </Button>
          <AppDialog
            open={openNotifyNoPlayerJoined}
            setOpen={setOpenNotifyNoPlayerJoined}
            title='No Team/Players Joined'
            description='There are currently no teams or players joined in your event.'>
            <div className=' flex items-center justify-between gap-5'>
              <AppButton
                text='Cancel'
                variant='outline'
                classname=' h-12 bg-black  font-bold w-full max-w-[300px]'
                onClick={() => setOpenNotifyNoPlayerJoined(false)}
              />
              <AppButton
                text='Start Game Anyway'
                classname=' h-12 bg-black text-primary hover:bg-black font-bold w-full max-w-[300px] '
                onClick={() => handlePublish('start-quiz')}
              />
            </div>
          </AppDialog>
        </>
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
            disabled={
              gameState.question && !gameState.question.isLast ? true : false
            }
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

        {!isTrivia && round_started && !gameState.question && (
          <Button
            disabled={gameState.totalPlayers.length < 2}
            onClick={() => handlePublish('set-question-index', { index: null })}
            className='py-0 h-max text-xs bg-transparent'
            variant='ghost'>
            <UserCircle />
            Next Dealer
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
              disabled={(gameState.question.isLast && isTrivia) || timer > 0}
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
            {!isTrivia && (
              <>
                <Button
                  disabled={timer > 0 || gameState.isRevealAnswer}
                  onClick={() => handlePublish('allow-buzzer')}
                  className='py-0 h-max text-xs bg-transparent'
                  variant='ghost'>
                  <BellDot />
                  Open Buzzer
                </Button>
              </>
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

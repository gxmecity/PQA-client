import { RealtimeChannel } from 'ably'
import { useState } from 'react'
import WaitingArea from './WaitingArea'
import GameInterface from '@/components/GamePlayInterface'
import { Button } from '@/components/ui/button'
import { EnterFullScreenIcon, ExitFullScreenIcon } from '@radix-ui/react-icons'
import useFullscreen from '@/hooks/useFullScreen'

interface QuizGameProps {
  hostChannel: RealtimeChannel
  roomChannel: RealtimeChannel
  hostEntryCode: string
  entryCode: string
}

interface GlobalGameState {
  quiz_started: boolean
  quiz_ended: boolean
  round: {
    title: string
    type: string
    time: number
    index: number
    round_started: boolean
    round_ended: boolean
    isLast: boolean
  } | null
  question: {
    questionText: string
    options: string[]
    correctAnswerIndex: number
  } | null
  questionIndex: number | null
}

function QuizGame({
  hostChannel,
  roomChannel,
  hostEntryCode,
  entryCode,
}: QuizGameProps) {
  const [gameState, setGameState] = useState<GlobalGameState>({
    quiz_started: false,
    quiz_ended: false,
    round: null,
    question: null,
    questionIndex: null,
  })

  const { isFullscreen, exitFullscreen, activateFullscreen } = useFullscreen()

  const [seconds, setSeconds] = useState<number>(0)

  //   if (!gameState.quiz_started) return <WaitingArea roomCode={entryCode} />

  return (
    <div className=' h-screen flex flex-col'>
      <div className=' h-8 bg-black/50 px-4 py-1 flex items-center gap-5 text-xs justify-between'>
        <div className=' flex gap-2 items-center flex-1'>
          <p>Total players: 10</p>
          <p>Connected players: 8</p>
          <p>Bonus: 10</p>
        </div>
        <div className='flex-1 flex justify-center'>
          <span className=' text-white/70'>Room Code:</span>
          <span className=' text-white font-bold'>{entryCode}</span>
        </div>
        <div className=' flex-1 flex justify-end'>
          <p>Hosts: 0</p>
        </div>
      </div>
      <div className=' flex-auto'>
        <GameInterface roundTitle='FINISH THE LYRICS'>
          <div className=' h-full'>
            <p>Hello</p>
          </div>
        </GameInterface>
      </div>
      <div className=' h-8 bg-black/50 px-4 py-1 flex items-center gap-5 text-sm justify-between'>
        <div className=' flex items-center gap-2'>
          <Button
            className=' py-0 h-max text-xs bg-transparent'
            variant={'ghost'}>
            Start/Restart Round
          </Button>
          <Button
            className=' py-0 h-max text-xs bg-transparent'
            variant={'ghost'}>
            Skip/End Round
          </Button>
          <Button
            className=' py-0 h-max text-xs bg-transparent'
            variant={'ghost'}>
            Next Question
          </Button>
          <Button
            className=' py-0 h-max text-xs bg-transparent'
            variant={'ghost'}>
            Prev Question
          </Button>
          <Button
            className=' py-0 h-max text-xs bg-transparent'
            variant={'ghost'}>
            Show Answer
          </Button>
        </div>
        <div className=' flex items-center gap-2'>
          <Button
            className=' py-0 h-max text-xs bg-transparent'
            variant={'ghost'}>
            End Quiz
          </Button>
          {isFullscreen ? (
            <Button
              onClick={() => exitFullscreen()}
              className=' py-0 h-max text-xs bg-transparent'
              variant={'ghost'}>
              <ExitFullScreenIcon />
            </Button>
          ) : (
            <Button
              onClick={() => activateFullscreen()}
              className=' py-0 h-max text-xs bg-transparent'
              variant={'ghost'}>
              <EnterFullScreenIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizGame

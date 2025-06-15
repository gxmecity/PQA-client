import GameInterface from '@/components/GamePlayInterface'
import { gameActions } from '@/redux/game'
import { useAppDisPatch, useAppSelector } from '@/redux/store'
import { RealtimeChannel } from 'ably'
import { useEffect, useState, useCallback } from 'react'
import QuizRound from './QuizRound'
import WaitingArea from './WaitingArea'
import GameControlPanel from './_components/GameControlPanel'
import GameStatusBar from './_components/GameStatusBar'
import GameSplashScreen from '@/components/GameSplashScreen'
import StartGameScreen from './_components/StartGameScreen'

interface QuizGameProps {
  hostChannel: RealtimeChannel
  roomChannel: RealtimeChannel
  hostEntryCode: string
  entryCode: string
}

function QuizGame({
  hostChannel,
  roomChannel,
  hostEntryCode,
  entryCode,
}: QuizGameProps) {
  const [timer, setTimer] = useState(0)
  const [questionTimer, setQuestionTimer] = useState(0)
  const [startingQuiz, setStartingQuiz] = useState(false)

  const { quiz_started, quiz_ended } = useAppSelector((state) => state.game)
  const dispatch = useAppDisPatch()

  const handleMessage = useCallback(
    (msg: any) => {
      const { name, data } = msg

      switch (name) {
        case 'quiz-started':
          setStartingQuiz(true)
          dispatch(
            gameActions.updateGameState({
              quiz_started: true,
              round: data.round,
              canRevealAnswer: data.canRevealAnswer,
            })
          )
          break
        case 'new-round':
          dispatch(
            gameActions.updateGameState({
              round: data.round,
              question: null,
              canRevealAnswer: data.canRevealAnswer,
              answeredQuestions: [],
            })
          )
          break
        case 'start-round':
          dispatch(gameActions.updateGameRound({ round_started: true }))
          break
        case 'countdown-timer':
          setTimer(data.timer)
          break
        case 'question-timer':
          setQuestionTimer(data.timer)
          console.log(data.timer)
          break
        case 'new-question':
          dispatch(
            gameActions.updateGameState({
              question: data.question,
              isRevealAnswer: false,
              answeredQuestions: data.answeredQuestions,
            })
          )
          break
        case 'answer-reveal':
          dispatch(gameActions.updateGameState({ canRevealAnswer: true }))
          break
        case 'show-answer':
          dispatch(gameActions.updateGameState({ isRevealAnswer: true }))
          break
        case 'quiz-ended':
          dispatch(gameActions.updateGameState({ quiz_ended: true }))
          cleanupChannels()
          break
        default:
          console.warn('Unhandled event:', name)
      }
    },
    [dispatch]
  )

  const subscribeToRoomChannel = useCallback(() => {
    const eventNames = [
      'quiz-started',
      'new-round',
      'start-round',
      'countdown-timer',
      'question-timer',
      'new-question',
      'answer-reveal',
      'show-answer',
      'quiz-ended',
    ]

    eventNames.forEach((event) => {
      roomChannel.subscribe(event, (msg) =>
        handleMessage({ name: event, data: msg.data })
      )
    })

    return () => {
      eventNames.forEach((event) => roomChannel.unsubscribe(event))
    }
  }, [roomChannel, handleMessage])

  const cleanupChannels = useCallback(() => {
    try {
      roomChannel.detach()
      hostChannel.detach()
    } catch (err) {
      console.error('Error detaching channels:', err)
    }
  }, [roomChannel, hostChannel])

  useEffect(() => {
    subscribeToRoomChannel()
  }, [])

  if (quiz_ended)
    return (
      <GameSplashScreen>
        <div className=' h-[300px] bg-game-background/55 backdrop-blur-xl backdrop-opacity-55 w-[500px] rounded-lg p-5 '>
          Quiz Ended
        </div>
      </GameSplashScreen>
    )

  if (startingQuiz)
    return (
      <StartGameScreen onCompleteAnimation={() => setStartingQuiz(false)} />
    )

  if (!quiz_started) {
    return (
      <div className='h-screen flex flex-col'>
        <GameStatusBar entryCode={entryCode} hostCode={hostEntryCode} />
        <div className='flex-auto'>
          <WaitingArea roomCode={entryCode} />
        </div>
        <GameControlPanel hostChannel={hostChannel} />
      </div>
    )
  }

  return (
    <div className='h-dvh flex flex-col'>
      <GameStatusBar entryCode={entryCode} hostCode={hostEntryCode} />
      <div className='flex-1 overflow-auto'>
        <GameInterface>
          <div className='h-full'>
            <QuizRound
              hostChannel={hostChannel}
              timer={timer}
              questionTimer={questionTimer}
            />
          </div>
        </GameInterface>
      </div>
      <GameControlPanel hostChannel={hostChannel} />
    </div>
  )
}

export default QuizGame

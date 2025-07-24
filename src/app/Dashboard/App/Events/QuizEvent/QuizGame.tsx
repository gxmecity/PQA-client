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
import { toast } from 'sonner'

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

  const { quiz_started, quiz_ended, totalPlayers } = useAppSelector(
    (state) => state.game
  )
  const dispatch = useAppDisPatch()

  const handleMessage = useCallback(
    (msg: any) => {
      const { name, data } = msg

      switch (name) {
        case 'new-player':
          dispatch(gameActions.addNewPlayerToState(data.player))
          toast.success('New Player Joined', {
            description: `${data.player.name} has joined the game.`,
          })
          break
        case 'exiting-player':
          dispatch(gameActions.updateExitingPlayerState(data.playerId))
          break

        case 'new-remote-device':
          toast.success('Remote Device Connected', {
            description: `${data.deviceId} joined as a remote host device.`,
          })
          dispatch(
            gameActions.updateGameState({
              connectedRemoteDevices: data.hostDevices,
            })
          )
          break
        case 'exiting-remote-device':
          toast.success('Remote Device Disconnected', {
            description: `${data.deviceId} exited as a remote host device.`,
          })
          dispatch(
            gameActions.updateGameState({
              connectedRemoteDevices: data.hostDevices,
            })
          )
          break
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
              dealer_index: data.dealer_index || 0,
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
          break
        case 'new-question':
          dispatch(
            gameActions.updateGameState({
              question: data.question,
              isRevealAnswer: false,
              answeredQuestions: data.answeredQuestions,
              bonusLineUp: [],
              ...(data.dealer_index !== undefined && {
                dealer_index: data.dealer_index,
              }),
            })
          )
          break
        case 'answer-reveal':
          dispatch(gameActions.updateGameState({ canRevealAnswer: true }))
          break
        case 'show-answer':
          dispatch(gameActions.updateGameState({ isRevealAnswer: true }))
          break
        case 'bonus-request':
          dispatch(gameActions.addToBonusLineUp(data.player))
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
      'new-remote-device',
      'exiting-remote-device',
      'new-round',
      'start-round',
      'countdown-timer',
      'question-timer',
      'new-question',
      'answer-reveal',
      'new-player',
      'exiting-player',
      'show-answer',
      'bonus-request',
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
        <div className=' h-[300px] bg-game-background/60 backdrop-blur-xl backdrop-opacity-55 w-[500px] rounded-lg p-5  flex flex-col text-center justify-center'>
          <h3 className=' text-2xl font-bold text-game-foreground'>
            That's a wrap!
          </h3>
          <h1 className=' text-7xl text-game dharma-gothic-heavy'>
            Thank you for playing
          </h1>
          <p className=' text-game-foreground'>
            Brains were tested, and champions were made.
          </p>
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
          <WaitingArea roomCode={entryCode} joinedPlayers={totalPlayers} />
        </div>
        <GameControlPanel hostChannel={hostChannel} timer={questionTimer} />
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
      <GameControlPanel hostChannel={hostChannel} timer={questionTimer} />
    </div>
  )
}

export default QuizGame

import AppButton from '@/components/AppButton'
import GameInterface from '@/components/GameInterface'
import Loader from '@/components/Loader'
import { ablyClient } from '@/lib/ably'
import { errorResponseHandler, generateQuizEntryCode } from '@/lib/utils'
import ErrorPage from '@/routes/ErrorPage'
import {
  useGetEventByIdQuery,
  useUpdateQuizEventMutation,
} from '@/services/events'
import { useLazyGetUserQuizDetailsQuery } from '@/services/quiz'
import { RealtimeChannel } from 'ably'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Game from './Game/Game'
import EmptyState from '@/components/EmptyState'
import AppLogo from '@/components/AppLogo'

export interface GameEvent {
  event_data: QuizEvent
  quiz: Quiz
  event_channels: {
    hostChannel: RealtimeChannel
    roomChannel: RealtimeChannel
  }
}

export function Component() {
  const { id } = useParams()
  const [roomReady, setRoomReady] = useState(false)

  const { isLoading, data } = useGetEventByIdQuery(id!, {
    skip: !id,
  })
  const [getQuizDetails, { isLoading: fetchingGame }] =
    useLazyGetUserQuizDetailsQuery()

  const [gameEventData, setGameEventData] = useState<GameEvent | null>(null)

  const [updateQuizEvent, { isLoading: updatingEvent }] =
    useUpdateQuizEventMutation()

  const createQuizRoom = async () => {
    const hostEntryCode = generateQuizEntryCode()
    const entryCode = generateQuizEntryCode()

    try {
      const response = await updateQuizEvent({
        id: data?._id!,
        data: { host_entry_code: hostEntryCode, entry_code: entryCode },
      }).unwrap()

      const quiz = await getQuizDetails(response.quiz).unwrap()

      toast.success('Quiz Room Ready', {
        description: 'Your quiz room is created and ready for use.',
      })

      const hostChannel = ablyClient.channels.get(`${entryCode}:host`)
      const quizRoomChannel = ablyClient.channels.get(`${entryCode}:primary`)

      setGameEventData({
        event_channels: {
          hostChannel: hostChannel,
          roomChannel: quizRoomChannel,
        },
        event_data: response,
        quiz,
      })

      setRoomReady(true)
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  if (isLoading) return <Loader />

  if (!data) return <ErrorPage />

  return (
    <main className=' h-dvh bg-gradient-to-tr from-white to-primary flex items-center justify-center text-center'>
      {roomReady && gameEventData && gameEventData.quiz ? (
        <Game data={gameEventData} />
      ) : roomReady && gameEventData && !gameEventData.quiz ? (
        <GameInterface>
          <EmptyState
            title='Quiz Not Found'
            description='Opps. Seems like we could not find your quiz data'
          />
        </GameInterface>
      ) : (
        <GameInterface>
          <div className=' text-black max-w-5xl mx-auto flex flex-col items-center justify-between h-full'>
            <h1 className=' font-bold text-2xl'>{data.title}</h1>
            <p className=''>Game Host: {data.creator.fullname}</p>
            <div className=' h-64 flex items-center justify-center'>
              <div className='w-72'>
                <AppLogo variant='white' />
              </div>
            </div>
            <AppButton
              text='Create Quiz Room'
              classname=' h-12 bg-black text-primary hover:bg-black font-bold w-full max-w-[300px] text-lg'
              onClick={createQuizRoom}
              loading={updatingEvent || fetchingGame}
            />
          </div>
        </GameInterface>
      )}
    </main>
  )
}

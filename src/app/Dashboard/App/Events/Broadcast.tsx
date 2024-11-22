import AppButton from '@/components/AppButton'
import Clock from '@/components/Countdown'
import GameInterface from '@/components/GameInterface'
import { useState } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import Game from './Game/Game'
import { ablyClient } from '@/lib/ably'
import {
  useGetEventByIdQuery,
  useUpdateQuizEventMutation,
} from '@/services/events'
import { useParams } from 'react-router-dom'
import Loader from '@/components/Loader'
import AppDialog from '@/components/AppDialog'
import { errorResponseHandler, generateQuizEntryCode } from '@/lib/utils'
import { RealtimeChannel } from 'ably'
import { toast } from 'sonner'

interface GameEvent {
  event_data: QuizEvent
  event_channels: {
    hostChannel: RealtimeChannel
    roomChannel: RealtimeChannel
  }
}

export function Component() {
  const { id } = useParams()
  const [broadcast, setBroadcast] = useState(false)
  const handle = useFullScreenHandle()

  const { isLoading, data } = useGetEventByIdQuery(id!, {
    skip: !id,
  })

  const [gameEventData, setGameEventData] = useState<GameEvent | null>(null)
  const [open, setOpen] = useState(false)

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
      toast.success('Quiz Room Ready', {
        description: 'Your quiz room is created and ready for use.',
      })

      const hostChannel = ablyClient.channels.get(`${entryCode}:host`)
      const quizRoomChannel = ablyClient.channels.get(`${entryCode}:primary`)

      hostChannel.subscribe('open-room', (msg) => {
        setBroadcast(msg.data.broadcast)
        handle.enter()
      })
      hostChannel.presence.subscribe('enter', (data) => {
        console.log(data)
      })

      setGameEventData({
        event_channels: {
          hostChannel: hostChannel,
          roomChannel: quizRoomChannel,
        },
        event_data: response,
      })

      setOpen(true)
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  const startGameManually = () => {
    if (!gameEventData?.event_channels.hostChannel) return

    gameEventData.event_channels.hostChannel.publish('open-room', {
      broadcast: true,
    })
  }

  if (isLoading) return <Loader />

  if (!data) return <>Event Not found</>

  return (
    <>
      <FullScreen handle={handle}>
        <main className=' h-dvh bg-gradient-to-tr from-white to-primary flex items-center justify-center text-center'>
          {broadcast ? (
            <Game />
          ) : (
            <GameInterface>
              <div className=' text-black max-w-5xl mx-auto flex flex-col items-center gap-10'>
                <h1 className=' font-bold text-2xl'>{data.title}</h1>
                <p className=''>Game Host: {data.creator.fullname}</p>
                <div className=' h-64 flex items-center justify-center'>
                  Logo here
                </div>
                <AppButton
                  text='Create Quiz Room'
                  classname=' h-12 bg-black text-primary hover:bg-black font-bold w-full max-w-[300px] text-lg'
                  onClick={createQuizRoom}
                />
              </div>
            </GameInterface>
          )}
        </main>
      </FullScreen>
      <AppDialog open={open} setOpen={setOpen} title='Quiz Room Created'>
        <div className=' text-center flex flex-col items-center gap-3'>
          <p className='text-sm'>Host Code:</p>
          <h1 className=' font-bold text-2xl text-primary py-2 px-4 bg-muted rounded-lg'>
            {gameEventData?.event_data.host_entry_code}
          </h1>
          <small>
            <span className=' font-semibold text-primary'>
              DO NOT SHARE THIS CODE.
            </span>{' '}
            Go to <span className=' underline'>quiz.gxmecity.com</span> and
            enter this host code to remotely control your quiz.
          </small>
          <div className=' flex items-center justify-between gap-5 w-full'>
            <span className=' h-[0.5px] bg-primary flex-auto'></span>
            <p>OR</p>
            <span className=' h-[0.5px] bg-primary flex-auto'></span>
          </div>
          <AppButton
            text='Start Game Manually'
            classname=' h-12 font-bold w-full max-w-[300px] text-lg'
            onClick={startGameManually}
          />
        </div>
      </AppDialog>
    </>
  )
}

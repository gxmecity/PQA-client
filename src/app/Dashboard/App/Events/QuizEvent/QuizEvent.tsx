import AppLogo from '@/components/AppLogo'
import EmptyState from '@/components/EmptyState'
import GameInterface from '@/components/GamePlayInterface'
import GameSplashScreen from '@/components/GameSplashScreen'
import Loader from '@/components/Loader'
import { gameModes } from '@/components/QuizItem'
import { Button } from '@/components/ui/button'
import { ablyClient } from '@/lib/ably'
import { cn, generateQuizEntryCode, splitCodeInHalf } from '@/lib/utils'
import { useGetQuizDetailsQuery } from '@/services/quiz'
import { RealtimeChannel } from 'ably'
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import QuizGame from './QuizGame'

export function Component() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const mode = params.get('mode')
  const globalQuizChannel = ablyClient.channels.get('tpq-main-quiz-thread')

  const [eventChannels, seteventChannels] = useState<{
    hostChannel: RealtimeChannel
    roomChannel: RealtimeChannel
    entryCode: string
    hostEntryCode: string
    roomReady: boolean
  } | null>(null)

  const [selectedMode, setSelectedMode] = useState<number | null>(
    mode ? gameModes.findIndex((item) => item.mode === mode) : null
  )
  const [creatingQuizRoom, setcreatingQuizRoom] = useState(false)

  const [roomOpen, setRoomOpen] = useState(false)

  const { data: quiz, isLoading } = useGetQuizDetailsQuery(id!, {
    skip: !id,
  })

  const createQuizRoom = async () => {
    if (!id || selectedMode) return
    setcreatingQuizRoom(true)
    const hostEntryCode = generateQuizEntryCode()
    const entryCode = generateQuizEntryCode()

    const hostChannel = ablyClient.channels.get(`${entryCode}:host`)
    const roomChannel = ablyClient.channels.get(`${entryCode}:primary`)

    roomChannel.subscribe('room-ready', () => {
      seteventChannels({
        hostChannel,
        roomChannel,
        roomReady: true,
        entryCode,
        hostEntryCode,
      })
      setcreatingQuizRoom(false)
    })

    globalQuizChannel.presence.enter({
      roomCode: entryCode,
      hostCode: hostEntryCode,
      quizId: id,
      eventType: gameModes[selectedMode!].mode,
    })
  }

  if (isLoading) return <Loader />

  if (!quiz)
    return (
      <GameInterface>
        <EmptyState
          title='Quiz Not Found'
          description='The requested quiz could not be found.'
        />
      </GameInterface>
    )

  if (eventChannels && roomOpen)
    return (
      <QuizGame
        hostChannel={eventChannels.hostChannel}
        roomChannel={eventChannels.roomChannel}
        hostEntryCode={eventChannels.hostEntryCode}
        entryCode={eventChannels.entryCode}
      />
    )

  return (
    <GameSplashScreen>
      <div className=' flex flex-col gap-10 items-center h-full justify-around'>
        <div className=' w-[400px]'>
          <AppLogo />
        </div>
        <div className=' flex flex-col gap-2 items-center  bg-game-background/55 backdrop-blur-xl backdrop-opacity-55 w-[500px] rounded-lg p-5'>
          {creatingQuizRoom ? (
            <div>
              <div className='h-[250px]'>
                <Loader loadingText='Creating quiz room, please wait...' />
              </div>
            </div>
          ) : (
            <>
              {eventChannels && eventChannels.roomReady ? (
                <>
                  <div className=' flex items-center gap-2 w-full'>
                    <span className=' h-[1px] flex-auto bg-muted-foreground'></span>
                    <p className='text-muted-foreground text-sm'>
                      Add Remote Device
                    </p>
                    <span className=' h-[1px] flex-auto bg-muted-foreground'></span>
                  </div>
                  <div className=' flex flex-col items-center gap-3 text-center text-muted-foreground'>
                    <h4 className=' uppercase text-game text-lg'>
                      Quiz Room Ready!!
                    </h4>
                    <p>Host code:</p>
                    <div className=' w-max bg-game-background p-3 mx-auto rounded-lg'>
                      <h3 className=' text-3xl font-extrabold text-game text-center'>
                        {splitCodeInHalf(eventChannels.hostEntryCode)}
                      </h3>
                    </div>
                    <p className=' text-sm'>
                      <span className=' font-semibold text-primary'>
                        DO NOT SHARE THIS CODE.
                      </span>{' '}
                      Go to{' '}
                      <span className=' underline'>
                        {window.location.hostname}/host
                      </span>{' '}
                      and enter this host code to remotely control your quiz.
                    </p>
                    <Button
                      variant={'ghost'}
                      onClick={() => {
                        setRoomOpen(true)
                        globalQuizChannel.detach()
                      }}
                      className='w-full max-w-[200px] mx-auto h-12 text-game'>
                      Continue to quiz room
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className=' flex items-center gap-2 w-full'>
                    <span className=' h-[1px] flex-auto bg-muted-foreground'></span>
                    <p className='text-muted-foreground text-sm'>
                      Select game mode
                    </p>
                    <span className=' h-[1px] flex-auto bg-muted-foreground'></span>
                  </div>
                  <div className='flex gap-3 items-center'>
                    {gameModes.map((mode, index) => (
                      <Button
                        key={index}
                        variant={'outline'}
                        className={cn(
                          ' flex-auto h-16 hover:bg-black ',
                          selectedMode === index &&
                            ' border-game text-game hover:text-game'
                        )}
                        onClick={() => setSelectedMode(index)}>
                        {mode.icon}
                        <p>{mode.name}</p>
                      </Button>
                    ))}
                  </div>
                  {selectedMode !== null && (
                    <div className='mt-4 flex flex-col gap-3 text-center'>
                      <small className='text-xs text-muted-foreground '>
                        {gameModes[selectedMode].description}
                      </small>
                      {!gameModes[selectedMode].active && (
                        <small className='text-xs text-primary uppercase '>
                          coming soon..
                        </small>
                      )}
                      <Button
                        variant={'outline'}
                        onClick={createQuizRoom}
                        className='w-full max-w-[200px] mx-auto h-12'
                        disabled={!gameModes[selectedMode].active}>
                        Create Quiz Room
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </GameSplashScreen>
  )
}

import Loader from '@/components/Loader'
import { useAppSelector } from '@/redux/store'
import { useRetrieveUserSessionQuery } from '@/services/auth'
import { useGetEventByHostCodeQuery } from '@/services/events'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Game from './Game'
import Join from './Join'
import Login from './Login'

export function Component() {
  const [params] = useSearchParams()
  const roomCode = params.get('roomCode')
  const { user } = useAppSelector((state) => state.auth)
  const { isLoading: retrievingSession } = useRetrieveUserSessionQuery(
    undefined,
    {
      skip: user !== undefined,
    }
  )

  const { data, isLoading } = useGetEventByHostCodeQuery(roomCode!, {
    skip: !roomCode,
  })

  const [event, setEvent] = useState<QuizEvent | null>(null)

  useEffect(() => {
    if (data) {
      setEvent(data)
    }
  }, [data])

  if (isLoading || retrievingSession) return <Loader />

  if (!event)
    return (
      <main className=' h-full flex flex-col'>
        <Join setEvent={setEvent} />
      </main>
    )

  if (!user) return <Login />

  return (
    <main className=' h-full flex flex-col items-center'>
      <Game data={event} user={user} />
    </main>
  )
}

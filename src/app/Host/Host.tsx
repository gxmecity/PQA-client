import Loader from '@/components/Loader'
import { useGetEventByHostCodeQuery } from '@/services/events'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Game from './Game'
import Join from './Join'

export function Component() {
  const [params] = useSearchParams()
  const roomCode = params.get('roomCode')

  const { data, isLoading } = useGetEventByHostCodeQuery(roomCode!, {
    skip: !roomCode,
  })

  const [event, setEvent] = useState<QuizEvent | null>(null)

  useEffect(() => {
    if (data) {
      setEvent(data)
    }
  }, [data])

  if (isLoading) return <Loader />

  if (!event)
    return (
      <main className=' h-full flex flex-col'>
        <Join setEvent={setEvent} />
      </main>
    )

  return (
    <main className=' h-full flex flex-col items-center'>
      <Game data={event} />
    </main>
  )
}

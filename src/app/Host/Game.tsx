import React, { useEffect, useState } from 'react'
import WaitingArea from './WaitingArea'
import { ablyClient } from '@/lib/ably'

interface Props {
  data: QuizEvent
}

interface GlobalGameState {
  players: any[]
  quiz_started: boolean
  quiz_ended: boolean
  activeRound: Omit<Round, 'questions' | '_id'> | null
  round_started: boolean
  round_ended: boolean
  activeQuestion: QuizQuestion | null
}

export default function Game({ data }: Props) {
  const [globalGameState, setglobalGameState] = useState<GlobalGameState>({
    players: [],
    quiz_started: false,
    quiz_ended: false,
    activeRound: null,
    round_started: false,
    round_ended: false,
    activeQuestion: null,
  })
  const [broadCast, setbroadCast] = useState(false)

  const hostChannel = ablyClient.channels.get(`${data.entry_code}:host`)
  const roomChannel = ablyClient.channels.get(`${data.entry_code}:primary`)

  const subscribeToHostChannels = () => {
    hostChannel.subscribe('open-room', (msg) => {
      setbroadCast(msg.data.open)
    })
  }

  useEffect(() => {
    console.log(ablyClient.auth.clientId)
    roomChannel.presence.subscribe('enter', (player) => {
      console.log(player)
    })
    roomChannel.presence.subscribe('leave', (player) => {
      console.log(player)
    })

    hostChannel.presence.enter({
      name: 'Zubi',
    })

    subscribeToHostChannels()
  }, [data])

  const openQuizRoom = () => {
    hostChannel.publish('open-room', { open: true })
  }

  return (
    <>
      <div className=' h-10 bg-primary w-full flex items-center px-4 text-black'>
        Total players: {globalGameState.players.length}
      </div>
      <section className=' flex-auto max-w-5xl px-5'>
        {globalGameState.quiz_started ? (
          <></>
        ) : (
          <WaitingArea
            broadcast={broadCast}
            startBroadCast={openQuizRoom}
            joinCode={data.entry_code!}
          />
        )}
      </section>
    </>
  )
}

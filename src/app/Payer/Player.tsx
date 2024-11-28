import AppLogo from '@/components/AppLogo'
import { useState } from 'react'
import Game from './Game'
import Join from './Join'
import SelectTeam from './SelectTeam'

export interface QuizPlayer {
  name: string
  team_id?: string
  avatar?: string
  clientId?: string
}

export function Component() {
  const [event, setEvent] = useState<QuizEvent | null>(null)
  const [player, setPlayer] = useState<QuizPlayer | null>(null)

  if (!event)
    return (
      <main className=' h-full flex flex-col'>
        <Join setEvent={setEvent} />
      </main>
    )

  if (!player)
    return (
      <main className=' h-full flex flex-col'>
        <SelectTeam event={event} setPlayer={setPlayer} />
      </main>
    )

  return (
    <main className=' h-full flex flex-col max-w-5xl px-5'>
      <div
        className=' flex items-center justify-center gap-2 py-5
      '>
        <div className=' w-28'>
          <AppLogo />
        </div>
      </div>
      <Game user={player} data={event} />
    </main>
  )
}

import AppButton from '@/components/AppButton'
import GameInterface from '@/components/GameInterface'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Player } from './Game'

interface Props {
  title: string
  startQuiz: () => void
  joinedPlayers: Player[]
}

export default function WaitingArea({
  startQuiz,
  title,
  joinedPlayers,
}: Props) {
  return (
    <div className=' h-full flex flex-col justify-between items-center'>
      <h2 className='text-lg font-bold'>{title}</h2>
      <div className=' w-full flex flex-auto overflow-auto justify-center items-center pt-8'>
        {joinedPlayers.length ? (
          <div className=' h-full w-full flex justify-center  gap-10 flex-wrap'>
            <span className='h-max'>
              <Avatar className=' w-20 h-20 animate-pulse'>
                <AvatarFallback className='bg-black text-primary text-xl '>
                  DT
                </AvatarFallback>
              </Avatar>
              <p>Team Dath</p>
            </span>
            <span className='h-max'>
              <Avatar className=' w-20 h-20 animate-pulse'>
                <AvatarFallback className='bg-black text-primary text-xl'>
                  DT
                </AvatarFallback>
              </Avatar>
              <p>Team Dath</p>
            </span>
          </div>
        ) : (
          <div className=' animate-pulse'>
            <span>Logo Here</span>
            <p>Waiting for players....</p>
          </div>
        )}
      </div>
      <AppButton
        text='Start Game'
        classname=' h-12 bg-black text-primary hover:bg-black font-bold w-full max-w-[300px] text-lg'
        onClick={startQuiz}
      />
    </div>
  )
}

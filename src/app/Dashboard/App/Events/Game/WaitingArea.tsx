import AppAvater from '@/components/AppAvater'
import AppButton from '@/components/AppButton'
import AppLogo from '@/components/AppLogo'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

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
            {joinedPlayers.map((player) => (
              <span className='h-max'>
                <AppAvater
                  img_url={player.avatar_url}
                  fallbackText={player.name}
                />
                <p>{player.name}</p>
              </span>
            ))}
          </div>
        ) : (
          <div className=' animate-pulse'>
            <span className=' w-28'>
              <AppLogo variant='dark' />
            </span>
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

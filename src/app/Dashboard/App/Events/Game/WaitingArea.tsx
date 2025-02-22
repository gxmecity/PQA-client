import AppAvater from '@/components/AppAvater'
import AppButton from '@/components/AppButton'
import AppDialog from '@/components/AppDialog'
import AppLogo from '@/components/AppLogo'
import { AnimatedList } from '@/components/ui/animated-list'
import { useState } from 'react'

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
  const [open, setOpen] = useState(false)

  return (
    <>
      <AppDialog
        open={open}
        setOpen={setOpen}
        title='No Team/Players Joined'
        description='There are currently no teams or players joined in your event.'>
        <div className=' flex items-center justify-between gap-5'>
          <AppButton
            text='Cancel'
            variant='outline'
            classname=' h-12 bg-black  font-bold w-full max-w-[300px]'
            onClick={() => setOpen(false)}
          />
          <AppButton
            text='Start Game Anyway'
            classname=' h-12 bg-black text-primary hover:bg-black font-bold w-full max-w-[300px] '
            onClick={startQuiz}
          />
        </div>
      </AppDialog>
      <div className=' h-full flex flex-col justify-between gap-5 items-center'>
        <h2 className='text-lg font-bold'>{title}</h2>
        <div className=' max-w-5xl w-full flex flex-auto overflow-auto h-[600px] justify-center items-center'>
          {joinedPlayers.length ? (
            <AnimatedList className=' h-full w-full overflow-auto px-10 pt-5'>
              {joinedPlayers.map((player, index) => (
                <span
                  className='h-16 flex text-white px-3 gap-5 items-center bg-black/50 rounded-lg w-96 mx-auto '
                  key={index}>
                  <AppAvater
                    img_url={player.avatar_url}
                    fallbackText={player.name}
                  />
                  <p>{player.name}</p>
                </span>
              ))}
            </AnimatedList>
          ) : (
            <div className=' animate-pulse'>
              <span className=' w-36 block'>
                <AppLogo variant='white' />
              </span>
              <p>Waiting for players....</p>
            </div>
          )}
        </div>
        <AppButton
          text='Start Game'
          classname=' h-12 bg-black text-primary hover:bg-black font-bold w-full max-w-[300px] text-lg'
          onClick={
            joinedPlayers.length < 1 ? () => setOpen(true) : () => startQuiz()
          }
        />
      </div>
    </>
  )
}

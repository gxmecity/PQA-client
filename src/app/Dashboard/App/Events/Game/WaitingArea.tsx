import AppButton from '@/components/AppButton'
import GameInterface from '@/components/GameInterface'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Props {
  quiz: Quiz
  startQuiz: () => void
}

export default function WaitingArea({ startQuiz, quiz }: Props) {
  const players = []

  return (
    <div className=' h-full w-full'>
      <GameInterface>
        <div className=' h-full flex flex-col justify-between items-center'>
          <h2 className='text-lg font-bold'>{quiz.title}</h2>
          <div className=' w-full flex flex-auto overflow-auto justify-center items-center pt-8'>
            {!players.length ? (
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
      </GameInterface>
    </div>
  )
}

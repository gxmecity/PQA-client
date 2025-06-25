import AppButton from '@/components/AppButton'
import AppDialog from '@/components/AppDialog'
import AppLogo from '@/components/AppLogo'
import { splitCodeInHalf } from '@/lib/utils'
import { useState } from 'react'

interface Props {
  roomCode: string
  roomOpen: boolean
  totalPlayers: number
  startQuiz: () => void
  user: User
}

function WaitingArea({
  roomCode,
  roomOpen,
  totalPlayers,
  startQuiz,
  user,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <section className=' h-full p-5 mx-auto max-w-7xl'>
      <div className='  flex flex-col gap-4 text-center h-[80%] justify-around items-center pt-8'>
        <div>
          <div className=' w-24 mx-auto'>
            <AppLogo />
          </div>
          <h1 className=' text-game text-3xl font-bold'>Welcome to PQA Live</h1>
        </div>
        <div>
          <p className=' text-game'>Logged In as:</p>
          <p className=' font-medium italic text-game-foreground text-xl'>
            {user.fullname}
          </p>
          <small>{user.email}</small>
        </div>

        <div>
          {!roomOpen ? (
            <>
              <p className=' mb-10'>
                This screen should only be used by the quizmaster.
                <span className=' font-semibold text-game'>
                  {' '}
                  Make sure that the master code was not visible to any players.
                </span>
              </p>
              <p className=' mb-10'>
                Use this screen to remotely control the progess of your live
                quiz event.
              </p>
              <small>
                When you are ready, open the quiz room from your Host device to
                share the game code for players to join.
              </small>
            </>
          ) : (
            <>
              <p className=' text-muted-foreground text-xs mb-3'>
                Entry code:{' '}
              </p>
              <h1 className=' text-4xl font-bold mb-8 text-game'>
                {splitCodeInHalf(roomCode)}
              </h1>

              <p className='text-muted-foreground'>
                Share this code with teams/players to join your live quiz event.
              </p>
              <div className=' min-h-20 w-full'>
                <>
                  <p className=' text-muted-foreground text-xs'>
                    Start the quiz when all players have joined
                  </p>

                  <AppButton
                    text='Start Quiz'
                    classname=' h-12 mt-8 font-bold w-full max-w-[200px]  text-game border-game'
                    variant='outline'
                    onClick={
                      totalPlayers < 1 ? () => setOpen(true) : () => startQuiz()
                    }
                  />
                </>
              </div>
            </>
          )}
        </div>
      </div>
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
    </section>
  )
}

export default WaitingArea

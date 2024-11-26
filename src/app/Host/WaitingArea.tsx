import AppButton from '@/components/AppButton'
import AppLogo from '@/components/AppLogo'
import { splitCodeInHalf } from '@/lib/utils'

interface Props {
  broadcast: boolean
  startBroadCast: () => void
  startQuiz: () => void

  joinCode: string
}

export default function WaitingArea({
  broadcast,
  startBroadCast,
  joinCode,
  startQuiz,
}: Props) {
  return (
    <section className=' h-full'>
      <div className=' h-full flex flex-col gap-4 text-center justify-around items-center pt-8'>
        <div>
          <div className='w-26'>
            <AppLogo />
          </div>
          <h1 className=' text-primary text-3xl font-bold'>
            Welcome to PQA Live
          </h1>
        </div>

        <div>
          {!broadcast ? (
            <>
              <p className=' mb-10'>
                This screen should only be used by the quizmaster.
                <span className=' font-semibold text-primary'>
                  {' '}
                  Make sure that the master code was not visible to any players.
                </span>
              </p>
              <p className=' mb-10'>
                Use this screen to remotely control the progess of your live
                quiz event.
              </p>
              <small>
                When you are ready, open the quiz room to share the game code
                for teams and players to join.
              </small>
            </>
          ) : (
            <>
              <p className=' text-muted-foreground text-xs mb-3'>
                Entry code:{' '}
              </p>
              <h1 className=' text-4xl font-bold mb-8 text-primary'>
                {splitCodeInHalf(joinCode)}
              </h1>

              <p className='text-muted-foreground'>
                Share this code with teams/players to join your live quiz event.
              </p>
            </>
          )}
        </div>

        <div className=' min-h-20 w-full'>
          {!broadcast ? (
            <>
              <p className=' text-muted-foreground'>Ready to go?</p>

              <AppButton
                text='Open Quiz Room'
                classname=' h-12 mt-8 font-bold w-full max-w-[200px]  text-primary border-primary'
                variant='outline'
                onClick={startBroadCast}
              />
            </>
          ) : (
            <>
              <p className=' text-muted-foreground text-xs'>
                Start the quiz when all players have joined
              </p>

              <AppButton
                text='Start Quiz'
                classname=' h-12 mt-8 font-bold w-full max-w-[200px]  text-primary border-primary'
                variant='outline'
                onClick={startQuiz}
              />
            </>
          )}
        </div>
      </div>
    </section>
  )
}

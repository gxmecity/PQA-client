import AppAvater from '@/components/AppAvater'
import AppLogo from '@/components/AppLogo'
import GameSplashScreen from '@/components/GameSplashScreen'
import { Button } from '@/components/ui/button'
import { splitCodeInHalf } from '@/lib/utils'
import { EnterFullScreenIcon } from '@radix-ui/react-icons'
import QRCode from 'react-qr-code'

interface Props {
  roomCode: string
}

function WaitingArea({ roomCode }: Props) {
  return (
    <GameSplashScreen>
      <div className=' h-full w-full flex flex-col gap-5 pt-5'>
        <div className=' flex items-center justify-between px-5'>
          <h1 className=' text-4xl font-bold animate-pulse'>
            Waiting for players to join....
          </h1>
          <div className=' w-32'>
            <AppLogo />
          </div>
        </div>
        <div className=' flex-auto grid grid-cols-[70%_30%] gap-5 px-5'>
          <div className=' bg-game-background/30 rounded-lg p-4 flex flex-col gap-5'>
            <h1 className='text-game dharma-gothic-heavy text-5xl underline'>
              Joined Players
            </h1>

            <div className=' flex-auto grid grid-cols-2 gap-2 rounded-lg'>
              <div className='bg-game-background/50 flex flex-col gap-2 py-4'>
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className=' flex-auto max-h-16  bg-game-background/80 px-3 flex items-center gap-3'>
                    <AppAvater fallbackText='Minions' />
                    <p className=' text-lg font-bold text-white/80'>Minions</p>
                    <span className=' ml-auto  dharma-gothic-bold h-full text-3xl grid place-items-center w-10  border-l border-l-game/50 text-game'>
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
              {/* <div className='bg-game-background/50'></div> */}
            </div>
          </div>
          <div className=' flex flex-col items-center gap-5 justify-center'>
            <h2 className=' text-3xl font-extrabold underline'>
              Join the Quiz
            </h2>
            <div className=' h-[350px] w-[350px] bg-game-background/50 rounded-lg p-3'>
              <div className=' bg-white w-full h-full rounded-lg flex flex-col gap-2 p-2 items-center'>
                <p className='text-black'>Scan code to join</p>
                <div className='flex-auto w-full flex items-center justify-center'>
                  <QRCode
                    value={`http://localhost:5001/event/play?code=${roomCode}`}
                  />
                </div>
              </div>
            </div>
            <div className=' h-auto w-[350px] bg-game-background/80 rounded-lg p-3 flex flex-col gap-3'>
              <div className=' flex items-center gap-2 w-full'>
                <span className=' h-[1px] flex-auto bg-muted-foreground'></span>
                <p className='text-muted-foreground text-sm'>Join Quiz Room</p>
                <span className=' h-[1px] flex-auto bg-muted-foreground'></span>
              </div>
              <p className=' text-sm text-muted-foreground text-center mt-2'>
                Go to{' '}
                <span className='font-semibold text-game underline'>
                  {window.location.hostname}/play
                </span>{' '}
                on your device and enter the code below:
              </p>
              <div className=' w-max bg-game-background p-3 mx-auto rounded-lg'>
                <h3 className=' text-3xl font-extrabold text-game text-center'>
                  {splitCodeInHalf(roomCode)}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className=' h-10 bg-game-background px-4 py-1 flex items-center gap-5 text-sm justify-between'>
          <p>
            Host Devices: <span>0</span>
          </p>
          <div className=' flex gap-3 items-center'>
            <Button
              className=' py-0  h-max text-sm bg-transparent'
              variant={'ghost'}>
              Cancel & Exit Quiz
            </Button>
            <Button
              className=' py-0 h-max text-sm bg-transparent'
              variant={'ghost'}>
              Start Game
            </Button>
            <Button
              className=' py-0 h-max text-sm bg-transparent'
              variant={'ghost'}>
              <EnterFullScreenIcon />
            </Button>
          </div>
        </div>
      </div>
    </GameSplashScreen>
  )
}

export default WaitingArea

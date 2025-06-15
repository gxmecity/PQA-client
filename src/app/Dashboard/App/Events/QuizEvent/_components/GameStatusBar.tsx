import AppDialog from '@/components/AppDialog'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { splitCodeInHalf } from '@/lib/utils'
import { useState } from 'react'
import QRCode from 'react-qr-code'

interface Props {
  entryCode: string
  hostCode: string
}

function GameStatusBar({ entryCode, hostCode }: Props) {
  const [open, setOpen] = useState(false)
  const [openBonus, setOpenBonus] = useState(false)

  return (
    <>
      <div className=' h-8 bg-game-background px-4 py-1 flex items-center gap-5 text-xs justify-between'>
        <div className=' flex gap-2 items-center flex-1'>
          <p>Total players: 10</p>
          <button
            className='flex justify-center gap-2 w-max '
            onClick={() => setOpenBonus(true)}>
            Bonus: 10
          </button>
        </div>
        <div className='flex-1'>
          <button
            className='flex justify-center gap-2 w-max mx-auto h-full p-2 rounded-lg bg-black'
            onClick={() => setOpen(true)}>
            <span className=' text-white/70'>Room Code:</span>
            <span className=' text-white font-bold'>{entryCode}</span>
          </button>
        </div>
        <div className=' flex-1 flex justify-end'>
          <Popover>
            <PopoverTrigger>
              <p>Hosts: 0</p>
            </PopoverTrigger>
            <PopoverContent>
              <div className=' w-[200px] flex flex-col gap-2 text-center'>
                <p className=' text-sm text-muted-foreground'>
                  Add Host Device:
                </p>
                <small className='text-muted-foreground'>
                  Go to{' '}
                  <span className=' underline'>
                    {window.location.hostname}/host
                  </span>{' '}
                  and enter this host code to remotely control your quiz.
                </small>
                <div className=' w-max bg-black p-3 mx-auto rounded-lg'>
                  <h3 className=' text-xl font-extrabold text-game text-center'>
                    {splitCodeInHalf(hostCode)}
                  </h3>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <AppDialog open={open} setOpen={setOpen} title='Join Quiz Room'>
        <div className='flex flex-col items-center gap-2 justify-center'>
          <div className=' h-[400px] w-[400px] bg-game-background/50 rounded-lg p-3'>
            <div className=' bg-white w-full h-full rounded-lg flex flex-col gap-2 p-2 items-center'>
              <p className='text-black'>Scan code to join</p>
              <div className='flex-auto w-full flex items-center justify-center relative'>
                <QRCode
                  className=' h-full w-full absolute'
                  value={`http://localhost:5001/event/play?code=${entryCode}`}
                />
              </div>
            </div>
          </div>
          <div className=' h-auto w-[350px] bg-game-background/80 rounded-lg p-3 flex flex-col gap-3'>
            <div className=' flex items-center gap-2 w-full'>
              <span className=' h-[1px] flex-auto bg-muted-foreground'></span>
              <p className='text-muted-foreground text-sm'>OR</p>
              <span className=' h-[1px] flex-auto bg-muted-foreground'></span>
            </div>
            <p className=' text-sm text-muted-foreground text-center mt-2'>
              Go to{' '}
              <span className='font-semibold text-game underline'>
                {window.location.hostname}/play
              </span>{' '}
              on your device and enter the code below:
            </p>
            <div className=' w-max bg-black p-3 mx-auto rounded-lg'>
              <h3 className=' text-3xl font-extrabold text-game text-center'>
                {splitCodeInHalf(entryCode)}
              </h3>
            </div>
          </div>
        </div>
      </AppDialog>
      <AppDialog open={openBonus} setOpen={setOpenBonus} title='Bonus Requests'>
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className=' h-12 border-b border-b-border'>
              <div className='flex items-center gap-2'>
                <span className='text-xs'>Bonus Request by </span>
                <span className='text-sm font-semibold italic'>
                  We Know Nothing
                </span>
                <span className=' flex items-center ml-auto gap-2'>
                  <button className=' text-xs p-2 rounded-lg bg-black'>
                    + Bonus
                  </button>
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className=' flex justify-end'>
          <Button>Clear List</Button>
        </div>
      </AppDialog>
    </>
  )
}

export default GameStatusBar

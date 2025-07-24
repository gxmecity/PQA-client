import AppDialog from '@/components/AppDialog'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn, splitCodeInHalf } from '@/lib/utils'
import { gameActions } from '@/redux/game'
import { useAppDisPatch, useAppSelector } from '@/redux/store'
import { useState } from 'react'
import QRCode from 'react-qr-code'

interface Props {
  entryCode: string
  hostCode: string
}

function GameStatusBar({ entryCode, hostCode }: Props) {
  const [open, setOpen] = useState(false)
  const [openBonus, setOpenBonus] = useState(false)
  const dispatch = useAppDisPatch()

  const { totalPlayers, bonusLineUp, connectedRemoteDevices } = useAppSelector(
    (state) => state.game
  )

  return (
    <>
      <div className=' h-8 bg-game-background px-4 py-1 flex items-center gap-5 text-xs justify-between'>
        <div className=' flex gap-2 items-center flex-1'>
          <Popover>
            <PopoverTrigger>
              <p>
                Total Players: <span>{totalPlayers.length}</span>
              </p>
            </PopoverTrigger>
            <PopoverContent>
              <div className='h-auto max-h-[500px]'>
                {totalPlayers.map((player) => (
                  <div
                    key={player.clientId}
                    className=' h-10 flex items-center text-sm justify-between'>
                    <p>{player.name}</p>
                    <span
                      className={cn(
                        'italic text-xs',
                        player.status === 'offline'
                          ? 'text-red-500'
                          : ' text-green-600'
                      )}>
                      {player.status}
                    </span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          {!!bonusLineUp.length && (
            <button
              className='flex justify-center gap-2 w-max '
              onClick={() => setOpenBonus(true)}>
              Bonus: <span>{bonusLineUp.length}</span>
            </button>
          )}
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
              <p>
                Hosts: <span>{connectedRemoteDevices}</span>
              </p>
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
                  value={`${window.location.hostname}/join-event?code=${entryCode}`}
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
                {window.location.hostname}/join-event
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
          {bonusLineUp.map((request) => (
            <div
              key={request.gameId}
              className=' h-12 border-b border-b-border'>
              <div className='flex items-center gap-2'>
                <span className='text-xs'>Bonus Request by </span>
                <span className='text-sm font-semibold italic'>
                  {request.name}
                </span>
                <span className=' flex items-center ml-auto gap-2'>
                  <Button
                    variant={'ghost'}
                    className=' text-xs !p-2 rounded-lg bg-black'
                    disabled>
                    + Bonus
                  </Button>
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className=' flex justify-end'>
          <Button
            onClick={() =>
              dispatch(gameActions.updateGameState({ bonusLineUp: [] }))
            }>
            Clear List
          </Button>
        </div>
      </AppDialog>
    </>
  )
}

export default GameStatusBar

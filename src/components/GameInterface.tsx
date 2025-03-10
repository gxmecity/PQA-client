import { splitCodeInHalf } from '@/lib/utils'
import { ReactNode } from 'react'
import AppLogo from './AppLogo'

interface Props {
  children: ReactNode
  joinCode?: string
  numberOfPlayers?: number
  hostDevices?: number
}

export default function GameInterface({
  children,
  joinCode,
  numberOfPlayers,
  hostDevices,
}: Props) {
  return (
    <div className=' text-black h-full flex items-center flex-col justify-between py-10 gap-4 w-full relative'>
      {numberOfPlayers !== undefined && (
        <div className=' bg-black/40  w-max bottom-3 h-max py-3 rounded-lg px-2 sm:text-sm flex items-center absolute left-8 text-white'>
          <h3>
            Connected players:
            <span className='bg-black/60 font-medium px-2 py-2 rounded-md'>
              {numberOfPlayers}
            </span>
          </h3>
        </div>
      )}
      {joinCode && (
        <div className=' bg-black/40  w-max top-3 h-max py-3 rounded-lg px-2 sm:text-sm flex items-center absolute text-white'>
          <h3>
            Join @ {window.location.hostname}/play | Use code{' '}
            <span className='bg-black/60 font-medium px-2 py-2 rounded-md'>
              {splitCodeInHalf(joinCode)}
            </span>
          </h3>
        </div>
      )}
      {hostDevices !== undefined && (
        <div className=' bg-black/40  w-max top-3 h-max py-3 rounded-lg px-2 sm:text-sm flex items-center absolute right-8 text-white'>
          <h3>
            Host devices:
            <span className='bg-black/60 font-medium px-2 py-2 rounded-md'>
              {hostDevices}
            </span>
          </h3>
        </div>
      )}
      <div className=' w-full flex items-center gap-8'>
        <span className='h-[2px] bg-black w-[5%]'></span>
        <span className=' w-[6%]'>
          <AppLogo variant='white' />
        </span>
        <span className='h-[2px] bg-black flex-auto'></span>
      </div>
      <div className=' flex-auto w-full px-10'>{children}</div>
      <div className=' w-full flex items-center gap-20'>
        <span className='h-[2px] bg-black flex-auto'></span>
      </div>
    </div>
  )
}

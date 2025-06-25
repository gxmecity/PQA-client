import { ReactNode } from 'react'
import AppLogo from './AppLogo'

interface Props {
  children: ReactNode
  roundTitle?: string
}

export default function GameInterface({ children, roundTitle }: Props) {
  return (
    <div className=' text-game-foreground h-full flex items-center flex-col justify-between pb-10 gap-4 w-full relative bg-black/10'>
      <div className=' w-full flex items-center gap-8'>
        <span className='h-[2px] bg-game w-[5%]'></span>
        <span className=' w-[7%]'>
          <AppLogo variant='dark' />
        </span>
        <div className=' flex-auto flex items-center gap-8'>
          <span className='h-[2px] bg-game flex-auto'></span>
          {roundTitle && (
            <>
              <h1 className=' gd-text-game text-3xl  text-game'>
                {roundTitle}
              </h1>
              <span className='h-[2px] bg-game w-[5%]'></span>
            </>
          )}
        </div>
      </div>
      <div className=' flex-auto w-full px-[5%] overflow-scroll'>
        {children}
      </div>
      <div className=' w-full flex items-center gap-20'>
        <span className='h-[2px] bg-game flex-auto'></span>
      </div>
    </div>
  )
}

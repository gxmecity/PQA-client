import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  joinCode?: string
}

export default function GameInterface({ children, joinCode }: Props) {
  return (
    <div className=' text-black h-full flex items-center flex-col justify-between py-16 gap-8 w-full relative'>
      {joinCode && (
        <div className=' bg-muted/40  w-max top-3 h-max py-3 rounded-lg px-2 sm:text-sm flex items-center absolute text-white'>
          <h3>
            Join @ quiz.gxmecity.com | Use code{' '}
            <span className='bg-muted/60 font-medium px-2 py-2 rounded-md'>
              {joinCode}
            </span>
          </h3>
        </div>
      )}
      <div className=' w-full flex items-center gap-8'>
        <span className='h-[2px] bg-black w-[5%]'></span>
        <span className=' w-[10%]'>Logo here</span>
        <span className='h-[2px] bg-black flex-auto'></span>
      </div>
      <div className=' flex-auto w-full'>{children}</div>
      <div className=' w-full flex items-center gap-20'>
        <span className='h-[2px] bg-black flex-auto'></span>
      </div>
    </div>
  )
}

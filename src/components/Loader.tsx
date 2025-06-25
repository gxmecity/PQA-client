import AppLogo from './AppLogo'

interface Props {
  loadingText?: string
}

export default function Loader({ loadingText }: Props) {
  return (
    <div className=' h-full w-full flex flex-col gap-2 items-center justify-center'>
      <div className='w-20 animate-pulse'>
        <AppLogo />
      </div>
      <div className='text-muted-foreground text-sm mt-2'>{loadingText}</div>
    </div>
  )
}

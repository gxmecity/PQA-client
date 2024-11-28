import AppLogo from './AppLogo'

export default function Loader() {
  return (
    <div className=' h-full w-full flex items-center justify-center'>
      <div className='w-20 animate-pulse'>
        <AppLogo />
      </div>
    </div>
  )
}

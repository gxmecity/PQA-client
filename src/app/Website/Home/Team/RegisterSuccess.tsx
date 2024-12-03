import success from '@/assets/team reg.png'
import AppLogo from '@/components/AppLogo'
import EmptyState from '@/components/EmptyState'

export function Component() {
  return (
    <main className=' h-dvh flex flex-col justify-around py-10  px-5'>
      <span className=' w-28 block mx-auto'>
        <AppLogo />
      </span>
      <div className=' flex-auto'>
        <EmptyState
          icon={<img src={success} alt='Success image' className=' w-64' />}
          title='Full Steam Ahead!!'
          description="Your team has been registered successfully. Now it's time for you to conquer the Pub!!"
        />
      </div>
    </main>
  )
}

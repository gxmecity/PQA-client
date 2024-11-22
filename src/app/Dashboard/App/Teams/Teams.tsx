import AppAvater from '@/components/AppAvater'
import AppButton from '@/components/AppButton'
import AppDialog from '@/components/AppDialog'
import EmptyState from '@/components/EmptyState'
import { Input } from '@/components/ui/input'
import { cn, copyTextToClipboard } from '@/lib/utils'
import { useAppSelector } from '@/redux/store'
import { useGetUserRegisteredTeamsQuery } from '@/services/auth'
import { Copy, Search, Share, Users } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export function Component() {
  const { user } = useAppSelector((state) => state.auth)
  const [open, setOpen] = useState(false)

  const { data: teams = [], isLoading } = useGetUserRegisteredTeamsQuery(
    user?._id!,
    {
      skip: !user,
    }
  )

  const userUrl = `https://pubquiz.vercel.app/team/reg/${user?._id}`

  return (
    <main className=' dashboard_section'>
      <div className=' flex items-center justify-between'>
        <h1 className='dashboard_header'>Register Team</h1>
        <AppButton
          text='Share Registration URL'
          classname='text-primary'
          icon={<Share />}
          variant='ghost'
          onClick={() => setOpen(true)}
        />
      </div>
      <section className=' flex-auto grid grid-cols-[25%_75%] border-t border-t-border overflow-auto'>
        <div className='border-r border-r-border pr-8 pt-5 flex flex-col gap-5 '>
          <div className=' flex items-center border border-border rounded-md h-10 px-2'>
            <Search className='text-muted-foreground' size={16} />
            <Input
              placeholder='Search Team'
              className=' border-none outline-none focus-visible:ring-0'
            />
          </div>
          <div className=' flex-auto overflow-auto flex flex-col gap-4'>
            {teams.length ? (
              <>
                {teams.map((team) => (
                  <NavLink
                    to={`${team._id}`}
                    key={team._id}
                    className={({ isActive }) =>
                      cn(
                        ' flex items-center gap-3 w-full hover:bg-muted text-sm py-2 px-3 rounded-md',
                        isActive && ' bg-muted'
                      )
                    }>
                    <AppAvater img_url={team.sigil} fallbackText={team.name} />
                    <span>{team.name}</span>
                  </NavLink>
                ))}
              </>
            ) : isLoading ? (
              <div className=' h-full flex items-center justify-center'>
                Loading...
              </div>
            ) : (
              <EmptyState
                title={'No registered teams'}
                icon={<Users className='text-primary' />}
                description={
                  'Share your registration link to have teams register for your events'
                }
              />
            )}
          </div>
        </div>
        <div className='pt-5 pl-6 overflow-auto h-full'>
          <Outlet />
        </div>
      </section>
      <AppDialog open={open} setOpen={setOpen} title='Share Registration Url'>
        <div className=' text-center flex flex-col items-center gap-3'>
          <p className='text-sm'> Registration Url:</p>
          <h1 className='text-primary py-2 px-4 bg-muted rounded-lg truncate w-full max-w-[350px] text-sm'>
            {userUrl}
          </h1>
          <small>
            Share this url with teams to have them register for your quiz
            events.
          </small>

          <AppButton
            text='Copy Url'
            icon={<Copy />}
            classname=' h-12 font-bold w-full max-w-[300px] text-lg'
            onClick={() => copyTextToClipboard(userUrl)}
          />
        </div>
      </AppDialog>
    </main>
  )
}

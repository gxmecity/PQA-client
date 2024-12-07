import DashboardSummary from '@/components/DashboardSummary'
import DashboardTile from '@/components/DashboardTile'
import EmptyState from '@/components/EmptyState'
import { useAppSelector } from '@/redux/store'
import { useGetDashboardStatsQuery } from '@/services/auth'
import { CalendarCheck, CalendarX, Dices, Layers2, Users } from 'lucide-react'

export function Component() {
  const { user } = useAppSelector((state) => state.auth)

  const { data: dashboadStats } = useGetDashboardStatsQuery(undefined)

  return (
    <section className=' dashboard_section'>
      <h1 className=' dashboard_header'>Welcome, {user?.fullname}</h1>
      <div className='grid grid-cols-4 gap-4 md:grid-cols-2 sm:flex sm:flex-col'>
        <DashboardTile
          title='Total Games'
          value='10'
          icon={<Dices />}
          description='Quiz games created by you'
        />
        <DashboardTile
          title='Total Events'
          value='10'
          icon={<CalendarCheck />}
          description='Game events hosted by you'
        />
        <DashboardTile
          title='Total Series'
          value='10'
          icon={<Layers2 />}
          description='Game series organized by you'
        />
        <DashboardTile
          title='Registered Teams'
          value='10'
          icon={<Users />}
          description='Teams registered to your events'
        />
      </div>
      <div className='flex-auto grid grid-cols-3 gap-4 sm:flex sm:flex-col'>
        <DashboardSummary title='Recent Events' url=''>
          <EmptyState
            title='No Events Created'
            icon={<CalendarX className='text-primary' />}
            description='You are yet to host any events.'
          />
        </DashboardSummary>
        <DashboardSummary title='Registered Teams' url=''>
          <EmptyState
            title='No Registered Teams'
            icon={<Users className='text-primary' />}
            description='Share your registration link to have teams register for your events'
          />
        </DashboardSummary>
        <DashboardSummary title='Leaderboards' url=''>
          <EmptyState
            title='No Leaderboard'
            icon={<Layers2 className='text-primary' />}
            description='Create series and add events to see all time leaderboards'
          />
        </DashboardSummary>
      </div>
    </section>
  )
}

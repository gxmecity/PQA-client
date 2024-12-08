import AppAvater from '@/components/AppAvater'
import DashboardSummary from '@/components/DashboardSummary'
import DashboardTile from '@/components/DashboardTile'
import EmptyState from '@/components/EmptyState'
import Loader from '@/components/Loader'
import { getTimeDifferenceFromDate, cn } from '@/lib/utils'
import { useAppSelector } from '@/redux/store'
import {
  useGetDashboardStatsQuery,
  useGetUserRegisteredTeamsQuery,
} from '@/services/auth'
import { useGetUserHostedEventsQuery } from '@/services/events'
import {
  CalendarCheck,
  CalendarX,
  ChevronRight,
  Dices,
  Layers2,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const defaultStats: DashboardStats = {
  quiz: 0,
  events: 0,
  series: 0,
  userTeams: 0,
}

export function Component() {
  const { user } = useAppSelector((state) => state.auth)

  const { data: dashboadStat = defaultStats, isLoading } =
    useGetDashboardStatsQuery(undefined)

  const { data: events = [], isLoading: loadingEvents } =
    useGetUserHostedEventsQuery(user?._id!, {
      skip: !user,
    })
  const { data: teams = [], isLoading: loadingTeams } =
    useGetUserRegisteredTeamsQuery(user?._id!, {
      skip: !user,
    })

  return (
    <section className=' dashboard_section'>
      <h1 className=' dashboard_header'>Welcome, {user?.fullname}</h1>
      <div className='grid grid-cols-4 gap-4 md:grid-cols-2 sm:flex sm:flex-col'>
        <DashboardTile
          title='Total Games'
          value={`${dashboadStat.quiz}`}
          icon={<Dices />}
          description='Quiz games created by you'
          loading={isLoading}
        />
        <DashboardTile
          title='Total Events'
          value={`${dashboadStat.events}`}
          icon={<CalendarCheck />}
          description='Game events hosted by you'
          loading={isLoading}
        />
        <DashboardTile
          title='Total Series'
          value={`${dashboadStat.series}`}
          icon={<Layers2 />}
          description='Game series organized by you'
          loading={isLoading}
        />
        <DashboardTile
          title='Registered Teams'
          value={`${dashboadStat.userTeams}`}
          icon={<Users />}
          description='Teams registered to your events'
          loading={isLoading}
        />
      </div>
      <div className='flex-auto grid grid-cols-3 gap-4 sm:flex sm:flex-col'>
        <DashboardSummary title='Recent Events' url='events'>
          {loadingEvents ? (
            <Loader />
          ) : (
            <div className=' h-full flex flex-col gap-3'>
              {events.length ? (
                <>
                  {events.slice(0, 5).map((event) => (
                    <Link
                      to={`events/${event._id}`}
                      key={event._id}
                      className=' flex items-center space-x-4 rounded-md p-4'>
                      <div className='flex-1 space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                          {event.title}
                        </p>
                        <p className='text-xs italic text-muted-foreground '>
                          Played: {getTimeDifferenceFromDate(event.createdAt)}
                        </p>
                      </div>
                      <ChevronRight />
                    </Link>
                  ))}
                </>
              ) : (
                <EmptyState
                  title='No Events Created'
                  icon={<CalendarX className='text-primary' />}
                  description='You are yet to host any events.'
                />
              )}
            </div>
          )}
        </DashboardSummary>
        <DashboardSummary title='Registered Teams' url='teams'>
          {loadingTeams ? (
            <Loader />
          ) : (
            <div className=' h-full flex flex-col gap-3'>
              {teams.length ? (
                <>
                  {teams.slice(0, 5).map((team) => (
                    <Link
                      to={`teams/${team._id}`}
                      key={team._id}
                      className={cn(
                        ' flex items-center gap-3 w-full hover:bg-muted text-sm p-4 rounded-md'
                      )}>
                      <AppAvater
                        img_url={team.sigil}
                        fallbackText={team.name}
                      />
                      <span>{team.name}</span>
                    </Link>
                  ))}
                </>
              ) : (
                <EmptyState
                  title='No Registered Teams'
                  icon={<Users className='text-primary' />}
                  description='Share your registration link to have teams register for your events'
                />
              )}
            </div>
          )}
        </DashboardSummary>
        <DashboardSummary title='Leaderboards' url='series'>
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

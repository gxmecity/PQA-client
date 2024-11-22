import EmptyState from '@/components/EmptyState'
import Loader from '@/components/Loader'
import { useGetTeamDetailsQuery } from '@/services/auth'
import { Users } from 'lucide-react'
import { useParams } from 'react-router-dom'
import EditTeam from './EditTeamForm'

export function Component() {
  const { id } = useParams()

  const {
    data: team,
    isLoading: fetchingTeam,
    isFetching,
  } = useGetTeamDetailsQuery(id!, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  })

  if (fetchingTeam || isFetching) return <Loader />

  if (!team)
    return (
      <EmptyState
        title='Team not found'
        icon={<Users className='text-primary' />}
        description='The team you are looking for does not exist or has been deleted'
      />
    )

  return <EditTeam team={team} />
}

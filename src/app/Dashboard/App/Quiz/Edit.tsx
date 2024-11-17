import EmptyState from '@/components/EmptyState'

import { useGetUserQuizDetailsQuery } from '@/services/quiz'
import { useParams } from 'react-router-dom'
import EditQuizDetails from './EditQuizDetails'
import { Dices } from 'lucide-react'
import Loader from '@/components/Loader'

export function Component() {
  const { id } = useParams()

  const { data: quiz, isLoading } = useGetUserQuizDetailsQuery(id!, {
    skip: !id,
  })

  if (isLoading) return <Loader />

  if (!quiz)
    return (
      <EmptyState
        icon={<Dices className='text-primary' size={40} />}
        title='Quiz Not found'
        description='Sorry, the page you are looking for does not exist or has been deleted'
      />
    )

  return <EditQuizDetails quiz={quiz} />
}

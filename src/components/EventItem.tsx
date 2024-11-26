import { getTimeDifferenceFromDate } from '@/lib/utils'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

interface Props {
  event: QuizEvent
}

export default function EventItem({ event }: Props) {
  const timeplayed = getTimeDifferenceFromDate(event.createdAt)

  return (
    <Card className=' hover:border-primary/50 cursor-pointer'>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription className=' italic'>
          Played: {timeplayed}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

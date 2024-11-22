import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { getTimeDifferenceFromDate } from '@/lib/utils'

interface Props {
  event: QuizEvent
}

export default function EventItem({ event }: Props) {
  const timeplayed = getTimeDifferenceFromDate(event.createdAt)

  return (
    <Card className=' hover:border-primary/50 cursor-pointer h-40'>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription className=' italic'>
          Played: {timeplayed}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

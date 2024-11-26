import AppButton from '@/components/AppButton'
import AppDialog from '@/components/AppDialog'
import { AppSelect, SelectOptionType } from '@/components/AppSelect'
import EmptyState from '@/components/EmptyState'
import EventItem from '@/components/EventItem'
import Loader from '@/components/Loader'
import { Label } from '@/components/ui/label'
import { errorResponseHandler } from '@/lib/utils'
import { useAppSelector } from '@/redux/store'
import {
  useCreateHostedEventMutation,
  useGetUserHostedEventsQuery,
} from '@/services/events'
import { useGetUserCreatedQuizQuery } from '@/services/quiz'
import { CalendarCheck, Clock, Play, Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Component() {
  const { user } = useAppSelector((state) => state.auth)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const { data: events = [], isLoading: loadingEvents } =
    useGetUserHostedEventsQuery(user?._id!, {
      skip: !user,
    })

  const { data: quizzes = [], isLoading: loadingQuiz } =
    useGetUserCreatedQuizQuery(undefined, {
      skip: !open,
    })
  const [createEvent, { isLoading: creatingEvent }] =
    useCreateHostedEventMutation()

  const sortOptions: SelectOptionType[] = [
    {
      name: 'Date modified',
      value: 'updatedAt',
    },
    {
      name: 'Date created',
      value: 'createdAt',
    },
    {
      name: 'Name',
      value: 'name',
    },
  ]

  const handleSort = (arg: string) => {
    console.log(arg)
  }

  const handleCreateNewEvent = async (game: Quiz) => {
    try {
      const response = await createEvent({
        title: game.title,
        quiz: game._id,
      }).unwrap()

      navigate(`/broadcast/${response._id}`)
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  return (
    <div className=' dashboard_section'>
      <h1 className=' dashboard_header'>My Events</h1>
      <div className=' flex items-center gap-5 sm:flex-col'>
        <AppButton
          classname=' flex sm:w-full'
          text='Instant Event'
          icon={<Plus />}
          onClick={() => setOpen(true)}
        />
        <AppButton
          classname=' flex sm:w-full'
          text='Schedule Event'
          variant='secondary'
          icon={<Clock />}
          disabled
        />
        <AppSelect
          placeholder='Sort by'
          options={sortOptions}
          handleChange={handleSort}
          classname=' ml-auto'
          defaultValue='updatedAt'
        />
      </div>

      <div className=' flex-auto'>
        {loadingEvents ? (
          <Loader />
        ) : (
          <>
            {events.length ? (
              <>
                <Label className=' my-6 block'>My Events (08)</Label>
                <div className='grid gap-3 grid-cols-4 md:grid-cols-2 sm:grid-cols-1'>
                  {events.map((event) => (
                    <EventItem key={event._id} event={event} />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                title='No Events Created'
                icon={<CalendarCheck size={40} className='text-primary' />}
                description='Create ann event to get started'
              />
            )}
          </>
        )}
      </div>
      <AppDialog open={open} setOpen={setOpen} title='Select a Quiz to play'>
        <div className=' h-80 overflow-auto'>
          {quizzes.map((quiz) => (
            <div key={quiz._id} className=' flex justify-between items-center'>
              <div>
                <p className=' text-sm font-medium'>{quiz.title}</p>
                <small className=' text-muted-foreground italic'>
                  {quiz.rounds.length} rounds
                </small>
              </div>
              <AppButton
                icon={<Play />}
                text='Play'
                onClick={() => handleCreateNewEvent(quiz)}
                loading={creatingEvent}
              />
            </div>
          ))}
        </div>
      </AppDialog>
    </div>
  )
}

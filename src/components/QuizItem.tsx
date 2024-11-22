import { Clock, Pencil, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppButton from './AppButton'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn, errorResponseHandler } from '@/lib/utils'
import { useCreateHostedEventMutation } from '@/services/events'

interface Prop {
  data: Quiz
}

const QuizItem = ({ data }: Prop) => {
  const navigate = useNavigate()

  const [createEvent, { isLoading: creatingEvent }] =
    useCreateHostedEventMutation()

  const handleCreateNewEvent = async () => {
    if (creatingEvent) return

    try {
      const response = await createEvent({
        title: data.title,
        quiz: data._id,
      }).unwrap()

      navigate(`/broadcast/${response._id}`)
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='mb-2'>{data.title}</CardTitle>
        <CardDescription className=' text-xs italic'>
          {data.publish ? 'Public' : 'Private'} Quiz by {data.creator.fullname}
        </CardDescription>
        <CardDescription className=' text-xs italic'>
          This quiz has {data.rounds.length} rounds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className=' flex gap-3 sm:flex-col'>
          <AppButton
            text='Edit'
            variant='outline'
            icon={<Pencil />}
            onClick={() => navigate(`/dashboard/quiz/${data._id}`)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <Play />
                Play Game
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className='flex flex-col gap-2'>
                <div
                  className={cn(
                    'flex items-center gap-2 cursor-pointer',
                    creatingEvent && 'text-muted'
                  )}
                  onClick={handleCreateNewEvent}>
                  <Play size={30} />
                  <span className='flex flex-col gap-1'>
                    <small>
                      {creatingEvent ? 'Creating Event...' : 'Instant Event'}
                    </small>
                    <small className=' text-xs text-muted-foreground'>
                      Start an instant game with a group of friends
                    </small>
                  </span>
                </div>
                <div className=' flex items-center gap-2 cursor-pointer text-muted'>
                  <Clock size={30} />
                  <span className='flex flex-col gap-1'>
                    <small>Scheduled Event</small>
                    <small className=' text-xs'>
                      Schedule a game with a group of friends for a later time
                    </small>
                    <small className='text-xs text-primary uppercase'>
                      coming soon..
                    </small>
                  </span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuizItem

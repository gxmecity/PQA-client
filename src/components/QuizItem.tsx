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

interface Prop {
  data: Quiz
}

const QuizItem = ({ data }: Prop) => {
  const navigate = useNavigate()

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
                  className=' flex items-center gap-2 cursor-pointer'
                  onClick={() => navigate('/broadcast/1234')}>
                  <Play size={30} />
                  <span className='flex flex-col gap-1'>
                    <small>Instant Event</small>
                    <small className=' text-xs text-muted-foreground'>
                      Start an instant game with a group of friends
                    </small>
                  </span>
                </div>
                <div className=' flex items-center gap-2 cursor-pointer'>
                  <Clock size={30} />
                  <span className='flex flex-col gap-1'>
                    <small>Scheduled Event</small>
                    <small className=' text-xs text-muted-foreground'>
                      Schedule a game with a group of friends for a later time
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

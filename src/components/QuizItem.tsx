import { cn, errorResponseHandler } from '@/lib/utils'
import { useCreateHostedEventMutation } from '@/services/events'
import { Computer, Pencil, Play, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppButton from './AppButton'
import AppDialog from './AppDialog'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

interface Prop {
  data: Quiz
}

export const gameModes = [
  {
    name: 'In-person Mode',
    mode: 'offline',
    description:
      'Players don’t answer with phones. The host controls the game and keeps scores manually.',
    icon: <Users size={30} />,
    active: true,
  },
  {
    name: 'Online Mode',
    mode: 'online',
    description:
      'Players join with their phones, answer questions in real time, and scores are tracked automatically.',
    icon: <Computer size={30} />,
    active: false,
  },
]

const QuizItem = ({ data }: Prop) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [selectedMode, setSelectedMode] = useState<number | null>(null)

  const [createEvent, { isLoading: creatingEvent }] =
    useCreateHostedEventMutation()

  const handleEventQuizMode = async () => {
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

  const gameTypeOptions = [
    {
      name: 'Quiz Room Mode',
      recommeded: true,
      description:
        'Updated Quiz UI and Functionality. Faster and better quiz experience, better host control.',
      action: () => navigate(`/quiz-event/${data._id}`),
    },
    {
      name: 'Quiz Event Mode',
      recommeded: false,
      description: 'Old Quiz UI. Limited host controls and quiz experiennce.',
      action: handleEventQuizMode,
    },
  ]

  const handleCreateNewEvent = async () => {
    if (selectedMode === null) return

    const selectedOption = gameTypeOptions[selectedMode]

    selectedOption.action()
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='mb-2'>{data.title}</CardTitle>
          <CardDescription className=' text-xs italic'>
            {data.publish ? 'Public' : 'Private'} Quiz by{' '}
            {data.creator.fullname}
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
            <AppButton
              text='Play Quiz'
              variant='default'
              icon={<Play />}
              onClick={() => setOpen(true)}
            />
          </div>
        </CardContent>
      </Card>
      <AppDialog
        open={open}
        setOpen={setOpen}
        title='Host a new Quiz Game'
        description='Choose a mode to start the quiz'>
        <div className='flex  gap-2 items-center'>
          {gameTypeOptions.map((mode, index) => (
            <Button
              key={index}
              variant={'outline'}
              className={cn(
                ' flex-auto h-16',
                selectedMode === index && ' border-primary text-primary'
              )}
              onClick={() => setSelectedMode(index)}>
              {mode.name}
              {mode.recommeded && (
                <span className='text-[9px] font-semibold'>(RECOMMENED)</span>
              )}
            </Button>
          ))}
        </div>
        {selectedMode !== null && (
          <div className='mt-4 flex flex-col gap-3 text-center'>
            <small className='text-xs text-muted-foreground '>
              {gameTypeOptions[selectedMode].description}
            </small>

            <Button
              disabled={creatingEvent}
              className='w-full'
              onClick={handleCreateNewEvent}>
              Start Quiz
            </Button>
          </div>
        )}
      </AppDialog>
    </>
  )
}

export default QuizItem

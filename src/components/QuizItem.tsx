import { StarFilledIcon } from '@radix-ui/react-icons'
import { Pencil, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppButton from './AppButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'

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
          Private Quiz by KIzito Azubuike
        </CardDescription>
        <CardDescription className=' text-xs italic'>
          This quiz has {data.rounds.length} rounds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className=' flex gap-3 sm:flex-col'>
          <AppButton
            variant='outline'
            text='Add to Favorites'
            icon={<Star />}
          />
          <AppButton
            text='Edit'
            icon={<Pencil />}
            onClick={() => navigate(`/dashboard/quiz/${data._id}`)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default QuizItem

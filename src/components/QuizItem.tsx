import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Pencil, Play, Star, StarHalf } from 'lucide-react'
import AppButton from './AppButton'
import { StarFilledIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'

const QuizItem = () => {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader>
        <CardTitle className='mb-2'>Game Day 3 Quiz</CardTitle>
        <CardDescription className=' text-xs italic'>
          Private Quiz by KIzito Azubuike
        </CardDescription>
        <CardDescription className=' text-xs italic'>
          This quiz has 4 rounds
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
            onClick={() => navigate('/dashboard/quiz/1233')}
          />
        </div>
      </CardContent>
      <CardFooter className=' flex items-center'>
        <span className=' flex gap-1 items-center'>
          <StarFilledIcon />
          <StarFilledIcon />
          <StarFilledIcon />
          <StarFilledIcon />
          <StarFilledIcon />
        </span>
      </CardFooter>
    </Card>
  )
}

export default QuizItem

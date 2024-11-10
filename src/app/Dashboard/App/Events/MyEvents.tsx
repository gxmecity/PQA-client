import AppButton from '@/components/AppButton'
import { AppSelect, SelectOptionType } from '@/components/AppSelect'
import QuizItem from '@/components/QuizItem'
import { Label } from '@/components/ui/label'
import { quizzes } from '@/data'
import { StarFilledIcon } from '@radix-ui/react-icons'
import { Plus } from 'lucide-react'

export function Component() {
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

  return (
    <div className=' dashboard_section'>
      <h1 className=' dashboard_header'>My Quiz</h1>
      <div className=' flex items-center gap-5 sm:flex-col'>
        <AppButton
          classname=' flex sm:w-full'
          text='New Quiz'
          icon={<Plus />}
        />
        <AppButton
          classname=' flex sm:w-full'
          text='Favorites'
          variant='secondary'
          icon={<StarFilledIcon />}
        />
        <AppSelect
          placeholder='Sort by'
          options={sortOptions}
          handleChange={handleSort}
          classname=' ml-auto'
          defaultValue='updatedAt'
        />
      </div>
      <div>
        <Label className=' my-6 block'>My Quizes (08)</Label>
        <div className='grid gap-3 grid-cols-4 md:grid-cols-2 sm:grid-cols-1'>
          {quizzes.map((quiz) => (
            <QuizItem key={quiz._id} data={quiz} />
          ))}
        </div>
      </div>
    </div>
  )
}

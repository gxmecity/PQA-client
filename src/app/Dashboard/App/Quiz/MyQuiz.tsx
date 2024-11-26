import AppButton from '@/components/AppButton'
import { AppSelect, SelectOptionType } from '@/components/AppSelect'
import EmptyState from '@/components/EmptyState'
import ErrorMessage from '@/components/ErrorMessage'
import Loader from '@/components/Loader'
import QuizItem from '@/components/QuizItem'
import { Label } from '@/components/ui/label'
import { useGetUserCreatedQuizQuery } from '@/services/quiz'
import { StarFilledIcon } from '@radix-ui/react-icons'
import { Dices, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Component() {
  const {
    data = [],
    isLoading,
    isError,
  } = useGetUserCreatedQuizQuery(undefined)

  const navigate = useNavigate()

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
          onClick={() => navigate('../create-quiz')}
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
      <div className=' flex-auto'>
        <>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {isError ? (
                <ErrorMessage
                  title='Something went wrong'
                  variant='destructive'
                  description=" Sorry we're having issues fetching your quiz list"
                />
              ) : (
                <>
                  {data.length ? (
                    <>
                      <Label className=' my-6 block'>My Quizes (08)</Label>
                      <div className='grid gap-3 grid-cols-4 md:grid-cols-2 sm:grid-cols-1'>
                        {data.map((quiz) => (
                          <QuizItem key={quiz._id} data={quiz} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <EmptyState
                      title='No Quiz Added'
                      icon={<Dices size={40} className='text-primary' />}
                      description='Create new quiz to get started'
                    />
                  )}
                </>
              )}
            </>
          )}
        </>
      </div>
    </div>
  )
}

import AppButton from '@/components/AppButton'
import EmptyState from '@/components/EmptyState'
import FormCheckbox from '@/components/FormCheckbox'
import FormInput from '@/components/FormInput'
import FormTextArea from '@/components/FormTextArea'
import RoundItem from '@/components/RoundItem'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { errorResponseHandler } from '@/lib/utils'
import { createQuizSchema } from '@/schemas'
import {
  useDeleteUserQuizMutation,
  useUpdateUserQuizDetailsMutation,
} from '@/services/quiz'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlignVerticalDistributeCenter, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface Props {
  quiz: Quiz
}

export default function EditQuizDetails({ quiz }: Props) {
  const navigate = useNavigate()
  const [updateQuizDetails, { isLoading: updatingDetails }] =
    useUpdateUserQuizDetailsMutation()
  const [deleteQuiz, { isLoading: deletingQuiz }] = useDeleteUserQuizMutation()

  const form = useForm({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: quiz.title,
      description: quiz.description ?? '',
      publish: quiz.publish,
    },
  })

  const [rounds, setRounds] = useState<Round[]>(quiz.rounds ?? [])
  const [activeEditRoundIndex, setActiveEditRoundIndex] = useState<
    number | null
  >(null)

  const handleUpdateQuiz: SubmitHandler<Partial<Quiz>> = async (data) => {
    console.log(data)
    try {
      await updateQuizDetails({
        id: quiz._id,
        data,
      }).unwrap()

      toast.success('Quiz Updated')
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  const handleDeleteQuiz = async () => {
    try {
      await deleteQuiz(quiz._id).unwrap()

      toast.success('Quiz Deleted')
      navigate('../quiz')
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  const addNewRound = () => {
    const newObj: Round = {
      round_name: '',
      round_type: '',
      questions: [],
      timer: 0,
      _id: '',
    }
    setRounds((prev) => [...prev, newObj])
    setActiveEditRoundIndex(rounds.length)
  }

  useEffect(() => {
    setRounds(quiz.rounds)
  }, [quiz])

  return (
    <section className='dashboard_section overflow-x-hidden'>
      <h1 className='dashboard_header'>{quiz.title}</h1>
      <div className=' flex-auto'>
        <Card className=' w-full mb-5'>
          <CardHeader>
            <CardTitle>Edit quiz details</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateQuiz)}>
              <CardContent className=' flex flex-col gap-4'>
                <FormInput
                  name='title'
                  form={form}
                  type='text'
                  placeholder='Enter quiz title'
                  label='Title'
                />
                <FormTextArea
                  name='description'
                  form={form}
                  label='Description'
                  placeholder='Enter quiz description'
                />
                <FormCheckbox
                  name='publish'
                  form={form}
                  label='Publish Quiz'
                  description='Allow other quiz masters use this quiz for their events'
                />
              </CardContent>
              <CardFooter className='flex gap-5 justify-end'>
                <AppButton
                  text='Save'
                  classname=''
                  type='submit'
                  loading={updatingDetails}
                />
                <AppButton
                  text='Delete'
                  variant='destructive'
                  classname=''
                  type='button'
                  loading={deletingQuiz}
                  onClick={handleDeleteQuiz}
                />
              </CardFooter>
            </form>
          </Form>
        </Card>
        <Card className='flex flex-col'>
          <CardHeader className=' flex items-center justify-between flex-row'>
            <CardTitle>Rounds </CardTitle>
            <AppButton text='New Round' icon={<Plus />} onClick={addNewRound} />
          </CardHeader>
          <CardContent className=' w-full flex flex-col gap-3'>
            {!rounds.length ? (
              <EmptyState
                title='No Rounds Added'
                icon={
                  <AlignVerticalDistributeCenter className=' text-primary' />
                }
              />
            ) : (
              <>
                {rounds.map((round, index) => (
                  <RoundItem
                    data={round}
                    key={index}
                    quiz_id={quiz._id}
                    activeIndex={activeEditRoundIndex}
                    setActiveIndex={setActiveEditRoundIndex}
                    index={index}
                  />
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

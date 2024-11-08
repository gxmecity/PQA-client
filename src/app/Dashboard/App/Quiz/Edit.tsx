import AppButton from '@/components/AppButton'
import EmptyState from '@/components/EmptyState'
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
import { quizzes } from '@/data'
import { createQuizSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlignVerticalDistributeCenter, Plus } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export function Component() {
  const quiz = quizzes[0]

  const form = useForm({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: quiz.title,
      description: quiz.description ?? '',
    },
  })

  const [rounds, setRounds] = useState<Round[]>(quiz.rounds)

  const handleSubmit: SubmitHandler<any> = (data) => {
    console.log(data)
  }

  const addNewRound = () => {
    const newObj = {
      round_name: '',
      round_type: '',
      _type: 'round',
      _key: `round_key_${Date.now()}`,
      questions: [],
      category: '',
      timer: 0,
    }
    setRounds((prev) => [...prev, newObj])
  }

  return (
    <section className='dashboard_section overflow-x-hidden'>
      <h1 className='dashboard_header'>{quiz.title}</h1>
      <div className=' flex-auto'>
        <Card className=' w-full mb-5'>
          <CardHeader>
            <CardTitle>Edit quiz details</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
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
              </CardContent>
              <CardFooter className='flex gap-5 justify-end'>
                <AppButton text='Save' classname='' type='submit' />
                <AppButton
                  text='Publish'
                  classname=' border-primary text-primary'
                  variant='outline'
                  type='submit'
                />
                <AppButton
                  text='Delete'
                  variant='destructive'
                  classname=''
                  type='submit'
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
                {rounds.map((round) => (
                  <RoundItem data={round} key={round._key} />
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

import AppButton from '@/components/AppButton'
import FormInput from '@/components/FormInput'
import FormTextArea from '@/components/FormTextArea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { errorResponseHandler } from '@/lib/utils'
import { createQuizSchema } from '@/schemas'
import { useCreateNewQuizMutation } from '@/services/quiz'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function Component() {
  const navigate = useNavigate()

  const [createNewQuiz, { isLoading }] = useCreateNewQuizMutation()

  const form = useForm({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: '',
      description: '',
      publish: false,
    },
  })

  const handleSubmit: SubmitHandler<any> = async (data) => {
    try {
      const response = await createNewQuiz(data).unwrap()

      toast.success('Quiz Created')
      navigate(`../quiz/${response._id}`)
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  return (
    <section className=' dashboard_section flex items-center justify-center'>
      <Card className=' w-4/5 max-w-[500px]'>
        <CardHeader>
          <CardTitle>Create New Quiz</CardTitle>
          <CardDescription>Enter Quiz Details to create</CardDescription>
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
            <CardFooter className='flex flex-col'>
              <AppButton
                text='Create'
                classname=' w-full'
                type='submit'
                loading={isLoading}
              />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </section>
  )
}

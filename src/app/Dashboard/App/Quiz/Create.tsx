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
import { createQuizSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

export function Component() {
  const form = useForm({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const handleSubmit: SubmitHandler<any> = (data) => {
    console.log(data)
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
              <AppButton text='Create' classname=' w-full' type='submit' />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </section>
  )
}

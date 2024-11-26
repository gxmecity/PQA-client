import AppButton from '@/components/AppButton'
import AppLogo from '@/components/AppLogo'
import FormInput from '@/components/FormInput'
import { Form } from '@/components/ui/form'
import { errorResponseHandler } from '@/lib/utils'
import { joinRoomSchema } from '@/schemas'
import { useLazyGetEventByHostCodeQuery } from '@/services/events'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

interface Props {
  setEvent: (arg: QuizEvent | null) => void
}

export default function Join({ setEvent }: Props) {
  const form = useForm({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      code: '',
    },
  })

  const [getEventbyCode, { isLoading: getingEvent }] =
    useLazyGetEventByHostCodeQuery()

  const handleSubmit: SubmitHandler<{ code: string }> = async ({ code }) => {
    try {
      const event = await getEventbyCode(code).unwrap()

      setEvent(event)
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  return (
    <section className=' flex-auto flex flex-col items-center justify-center relative'>
      <div className=' w-3/4 max-w-[400px] h-full pt-20 justify-around  flex flex-col gap-6 items-center'>
        <div className=' text-center'>
          <div className=' w-28 mx-auto mb-5'>
            <AppLogo />
          </div>
          <h1 className=' text-3xl font-light'>Enter the code to join</h1>
          <small className=' text-muted-foreground'>
            It's on the screen in front of you
          </small>
        </div>

        <Form {...form}>
          <form className=' w-full' onSubmit={form.handleSubmit(handleSubmit)}>
            <FormInput
              form={form}
              name='code'
              type='number'
              placeholder='2343 9094'
            />
            <div className=' flex items-center justify-center'>
              <AppButton
                type='submit'
                text='Join'
                classname=' mt-6 min-w-32 mx-auto'
                loading={getingEvent}
              />
            </div>
          </form>
        </Form>
        <small className=' text-muted-foreground  text-xs max-w-[300px] text-center'>
          By using PQA you accept our{' '}
          <span className=' text-primary cursor-pointer'>terms of use </span>and{' '}
          <span className=' text-primary cursor-pointer'>policies</span>.
        </small>
      </div>
    </section>
  )
}

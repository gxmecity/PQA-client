import AppButton from '@/components/AppButton'
import AppLogo from '@/components/AppLogo'
import ErrorMessage from '@/components/ErrorMessage'
import FormInput from '@/components/FormInput'
import { Form } from '@/components/ui/form'
import { joinRoomSchema } from '@/schemas'
import { useLazyGetQuizRoomStatusQuery } from '@/services/quiz'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Host from './RemoteHost/Host'
import Player from './Player/Player'
import { useSearchParams } from 'react-router-dom'

export function Component() {
  const [params] = useSearchParams()
  const code = params.get('code')
  const [roomData, setRoomData] = useState<QuizRoomData | null>(null)
  const [errorMessage, setErrorMessage] = useState<{
    title: string
    desc: string
  } | null>(null)

  const [checkRoomStatus, { isLoading }] = useLazyGetQuizRoomStatusQuery()

  const form = useForm({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      code: code || '',
    },
  })

  const handleCodeSubmit: SubmitHandler<{ code: string }> = async ({
    code,
  }) => {
    try {
      const result = await checkRoomStatus(code).unwrap()

      setRoomData(result)
    } catch (error: any) {
      setErrorMessage({
        title: 'Error Finding Quiz Room',
        desc: error.data.message ?? 'Something went wrong',
      })
    }
  }

  if (roomData && roomData.isHost)
    return (
      <Host
        roomCode={roomData.entryCode}
        creator={roomData.creator}
        gameMode={roomData.eventMode}
      />
    )

  if (roomData)
    return (
      <Player
        roomCode={roomData.entryCode}
        creator={roomData.creator}
        gameMode={roomData.eventMode}
      />
    )

  return (
    <section className=' h-screen flex flex-col items-center justify-center relative'>
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
          <form
            className=' w-full  flex flex-col gap-5'
            onSubmit={form.handleSubmit(handleCodeSubmit)}>
            {errorMessage && (
              <ErrorMessage
                title={errorMessage.title}
                variant='destructive'
                description={errorMessage.desc}
              />
            )}
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
                disabled={isLoading}
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

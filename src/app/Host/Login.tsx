import AppButton from '@/components/AppButton'
import AppLogo from '@/components/AppLogo'
import FormInput from '@/components/FormInput'
import { Form } from '@/components/ui/form'
import { errorResponseHandler } from '@/lib/utils'
import { loginSchema } from '@/schemas'
import { useLoginUserMutation } from '@/services/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function Login() {
  const [loginUser, { isLoading }] = useLoginUserMutation()

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const submitUserLogin: SubmitHandler<LoginData> = async (data) => {
    try {
      await loginUser(data).unwrap()

      toast.success('Login Successful')
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  return (
    <main className=' h-dvh flex flex-col items-center justify-start gap-8 py-20  px-8'>
      <div className=' w-28'>
        <AppLogo />
      </div>
      <h1 className=' text-2xl font-light'>Login to Continue</h1>
      <Form {...form}>
        <form
          className='my-10 flex flex-col gap-5 w-full max-w-5xl'
          onSubmit={form.handleSubmit(submitUserLogin)}>
          <FormInput
            type='text'
            label='Email'
            form={form}
            name='email'
            placeholder='Enter Email address'
          />
          <FormInput
            type='password'
            label='Password'
            form={form}
            name='password'
            placeholder='Enter password'
          />
          <AppButton
            text='Sign in'
            type='submit'
            classname='h-12'
            loading={isLoading}
          />
        </form>
      </Form>
    </main>
  )
}

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/schemas'
import { Form } from '@/components/ui/form'
import FormInput from '@/components/FormInput'
import AppButton from '@/components/AppButton'
import { ModeToggle } from '@/components/ToggleTheme'
import {
  useLoginUserMutation,
  useRetrieveUserSessionQuery,
} from '@/services/auth'
import { toast } from 'sonner'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { errorResponseHandler } from '@/lib/utils'
import { useAppSelector } from '@/redux/store'
import image from '@/assets/Banner PQT.jpg'
import AppLogo from '@/components/AppLogo'
import Loader from '@/components/Loader'

export function Component() {
  const { user } = useAppSelector((state) => state.auth)
  const { isLoading: retrievingSession } = useRetrieveUserSessionQuery(
    undefined,
    {
      skip: user !== undefined,
    }
  )

  const [loginUser, { isLoading }] = useLoginUserMutation()
  const navigate = useNavigate()

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
      navigate('/dashboard')
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  if (retrievingSession) return <Loader />

  if (user) return <Navigate to='/dashboard' />

  return (
    <div className=' grid grid-cols-[35%_65%] h-full md:flex md:justify-center'>
      <div className='bg-card-foreground h-full overflow-hidden  md:hidden relative'>
        <span className=' absolute w-24 top-5 left-5 z-40'>
          <AppLogo variant='white' />
        </span>
        <img src={image} className=' w-full h-full' alt='' />
        <div className=' top-0  absolute z-20 h-full w-full bg-gradient-to-b from-black/80 to-transparent'></div>
      </div>
      <div className='flex items-center justify-center fex-col relative md:w-full'>
        <div className=' absolute top-3 right-3'>
          <ModeToggle />
        </div>
        <div className=' w-full py-10 flex items-center justify-center'>
          <div className='w-4/5 max-w-[400px]'>
            <span className='  w-24 mx-auto mb-5 hidden md:block'>
              <AppLogo variant='white' />
            </span>
            <h3 className='font-semibold text-2xl text-center'>Welcome back</h3>
            <p className='text-muted-foreground text-sm text-center'>
              Enter your email and password to log in
            </p>
            <Form {...form}>
              <form
                className='my-10 flex flex-col gap-5'
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
                <p className='text-muted-foreground text-sm text-center'>
                  Don't have an account?{' '}
                  <Link to='/signup' className=' font-medium text-primary'>
                    Sign up{' '}
                  </Link>
                </p>
              </form>
            </Form>

            <p className='text-muted-foreground text-sm text-center'>
              By clicking sign in, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import AppButton from '@/components/AppButton'
import FormCheckbox from '@/components/FormCheckbox'
import FormInput from '@/components/FormInput'
import { ModeToggle } from '@/components/ToggleTheme'
import { Form } from '@/components/ui/form'
import { errorResponseHandler } from '@/lib/utils'
import { signupSchema } from '@/schemas'
import { useSignUpNewUserMutation } from '@/services/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function Component() {
  const [signUpUser, { isLoading }] = useSignUpNewUserMutation()
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
      fullname: '',
      terms: false,
    },
  })

  const submitSignupData: SubmitHandler<SignupData> = async (data) => {
    const { email, password, fullname } = data

    try {
      await signUpUser({
        fullname,
        email,
        password,
      }).unwrap()

      toast.success('Account Created Successful')
      navigate('/dashboard')
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  return (
    <div className=' grid grid-cols-2 h-full md:flex md:justify-center'>
      <div className='bg-card-foreground md:hidden'></div>
      <div className='flex items-center justify-center fex-col relative md:w-full py-5'>
        <div className=' absolute top-3 right-3'>
          <ModeToggle />
        </div>
        <div className=' w-full py-10 flex items-center justify-center'>
          <div className='w-4/5 max-w-[400px]'>
            <h3 className='font-semibold text-2xl text-center'>
              {' '}
              Create an account
            </h3>
            <p className='text-muted-foreground text-sm text-center'>
              Create your account for an awesome quiz experience.
            </p>
            <Form {...form}>
              <form
                className='my-5 flex flex-col gap-3'
                onSubmit={form.handleSubmit(submitSignupData)}>
                <FormInput
                  type='text'
                  label='Fullname'
                  form={form}
                  name='fullname'
                  placeholder='Enter Fullname'
                />
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
                <FormInput
                  type='password'
                  label='Confirm Password'
                  form={form}
                  name='confirm_password'
                  placeholder='Enter password'
                />
                <FormCheckbox
                  name='terms'
                  form={form}
                  label='Terms & Privacy policy'
                  description='I agree with the terms of service and user policy.'
                />
                <AppButton
                  text='Sign Up'
                  type='submit'
                  classname='h-12'
                  loading={isLoading}
                />
                <p className='text-muted-foreground text-sm text-center'>
                  Already have an account?{' '}
                  <Link to='/login' className=' font-medium text-primary'>
                    Log in{' '}
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

import AppButton from '@/components/AppButton'
import AppLogo from '@/components/AppLogo'
import FormInput from '@/components/FormInput'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'

export function Component() {
  const form = useForm()

  return (
    <section className=' flex-auto flex flex-col items-center justify-center relative'>
      <div className=' w-3/4 max-w-[400px] flex flex-col gap-6 items-center'>
        <div className='w-26'>
          <AppLogo />
        </div>
        <div className=' text-center'>
          <h1 className=' text-3xl font-light'>Enter the code to join</h1>
          <small className=' text-muted-foreground'>
            It's on the screen in front of you
          </small>
        </div>

        <Form {...form}>
          <form className=' w-full'>
            <FormInput
              form={form}
              name=''
              type='number'
              placeholder='2343 9094'
            />
            <div className=' flex items-center justify-center'>
              <AppButton
                type='submit'
                text='Join'
                classname=' mt-6 min-w-32 mx-auto'
              />
            </div>
          </form>
        </Form>
      </div>

      <small className=' text-muted-foreground absolute bottom-5 text-xs max-w-[300px] text-center'>
        By using PQA you accept our{' '}
        <span className=' text-primary cursor-pointer'>terms of use </span>and{' '}
        <span className=' text-primary cursor-pointer'>policies</span>.
      </small>
    </section>
  )
}

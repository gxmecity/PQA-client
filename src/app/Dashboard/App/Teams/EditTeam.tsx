import AppButton from '@/components/AppButton'
import FormInput from '@/components/FormInput'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { registerTeamSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { MinusCircle, PlusCircle } from 'lucide-react'
import React from 'react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function Component() {
  const form = useForm({
    resolver: zodResolver(registerTeamSchema),
    defaultValues: {
      name: '',
      sigil: '',
      passphrase: '',
      team_members: [{ name: '' }, { name: '' }],
    },
  })

  const {
    fields: members,
    append: addMember,
    remove: deleteMember,
  } = useFieldArray({
    control: form.control,
    name: 'team_members',
  })

  const onSubmit: SubmitHandler<RegisterTeamData> = (data) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        className=' h-full flex flex-col gap-5 justify-between overflow-auto'
        onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex-auto'>
          <div className=' h-10'>
            <img src='' alt='' />
          </div>
          <div className=' flex flex-col gap-4'>
            <FormInput form={form} name='name' label='Team name' type='text' />
            <FormInput
              form={form}
              name='passphrase'
              description='Passphrase ensures that only team members can participate in quiz events using team details'
              label='Passphrase'
              type='password'
            />
          </div>
          <div className=' mt-4 flex flex-col gap-4'>
            <Label className='mt-4'>Team members</Label>
            {members.map((member, index) => (
              <div key={member.id} className=' flex items-start gap-4'>
                <FormInput
                  form={form}
                  name={`team_members[${index}].name`}
                  type='text'
                />
                <AppButton
                  icon={<MinusCircle />}
                  classname=' h-12'
                  variant='outline'
                  onClick={() => {
                    if (members.length <= 2)
                      return toast.error('Not Allowed', {
                        description:
                          'Teams must have at least 2 registered members',
                      })

                    deleteMember(index)
                  }}
                />
              </div>
            ))}
            <AppButton
              text='Add Member'
              classname='w-max h-12'
              icon={<PlusCircle />}
              variant='outline'
              onClick={() =>
                addMember({
                  name: '',
                })
              }
            />
          </div>
        </div>
        <div className=' flex items-center justify-end gap-4'>
          <AppButton
            type='button'
            variant='outline'
            text='Cancel'
            onClick={form.reset}
          />
          <AppButton type='submit' text='Register Team' />
        </div>
      </form>
    </Form>
  )
}

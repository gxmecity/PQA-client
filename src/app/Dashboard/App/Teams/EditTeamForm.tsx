import AppButton from '@/components/AppButton'
import FormInput from '@/components/FormInput'
import UploadWidget from '@/components/UploadWidjet'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { errorResponseHandler } from '@/lib/utils'
import { editTeamSchema, registerTeamSchema } from '@/schemas'
import {
  useRegisterNewTeamMutation,
  useUpdateTeamDetailsMutation,
} from '@/services/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { MinusCircle, PlusCircle, UploadCloud } from 'lucide-react'
import { useEffect } from 'react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface Props {
  team: Team
}

export default function EditTeam({ team }: Props) {
  const [upddateTeam, { isLoading }] = useUpdateTeamDetailsMutation()

  const form = useForm({
    resolver: zodResolver(editTeamSchema),
    defaultValues: {
      name: team?.name ?? '',
      sigil: team?.sigil ?? '',
      passphrase: '',
      team_members: team?.team_members.map((member) => ({ name: member })) ?? [
        { name: '' },
        { name: '' },
      ],
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

  function handleOnUpload(error: any, result: any, widget: any) {
    if (error) return

    form.setValue('sigil', result?.info?.secure_url)

    widget.close({
      quiet: true,
    })
  }

  const [name, image] = form.getValues(['name', 'sigil'])
  form.watch()

  const onSubmit: SubmitHandler<RegisterTeamData> = async (data) => {
    const teamMembers = data.team_members.map((member) => member.name)

    const teamData = new FormData()

    if (image) teamData.append('sigil', image)
    teamData.append('name', data.name)
    if (data.passphrase) teamData.append('passphrase', data.passphrase)
    teamData.append('team_members', JSON.stringify(teamMembers))

    try {
      await upddateTeam({
        id: team._id,
        data: teamData,
      }).unwrap()

      form.reset()
      toast.success('Team Updated Successfully')
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  const resetForm = () => {
    form.reset({
      name: team?.name ?? '',
      sigil: team?.sigil ?? '',
      passphrase: '',
      team_members: team?.team_members.map((member) => ({ name: member })) ?? [
        { name: '' },
        { name: '' },
      ],
    })
  }

  useEffect(() => {
    resetForm()
  }, [team])

  return (
    <Form {...form}>
      <form
        className=' h-full flex flex-col gap-5 justify-between'
        onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex-auto overflow-auto'>
          <div className=' h-60 w-60 border border-border mx-auto rounded-full bg-primary overflow-hidden'>
            {image ? (
              <img
                src={image}
                alt=''
                className=' h-full w-full object-cover block'
              />
            ) : (
              <>
                {name && (
                  <h1 className=' text-5xl text-white h-full flex items-center justify-center uppercase'>
                    {name
                      .split(' ')
                      .slice(0, 3)
                      .map((word) => word.slice(0, 1))}
                  </h1>
                )}
              </>
            )}
          </div>

          <UploadWidget onUpload={handleOnUpload}>
            {({ open }) => {
              return (
                <button
                  type='button'
                  className=' flex items-center text-xs text-muted-foreground mt-5 justify-center h-12 py-2 px-5 gap-3 border  border-border rounded-md w-max cursor-pointer mx-auto'
                  onClick={() => open()}>
                  <UploadCloud className='text-muted-foreground' size={18} />
                  Upload file
                </button>
              )
            }}
          </UploadWidget>

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
            onClick={resetForm}
          />
          <AppButton type='submit' text='Update Team' loading={isLoading} />
        </div>
      </form>
    </Form>
  )
}

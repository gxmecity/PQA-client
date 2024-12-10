import AppButton from '@/components/AppButton'
import { AppComboBox, ComboboxOption } from '@/components/AppComboBox'
import AppDialog from '@/components/AppDialog'
import AppLogo from '@/components/AppLogo'
import FormInput from '@/components/FormInput'
import Loader from '@/components/Loader'
import { Form } from '@/components/ui/form'
import { errorResponseHandler } from '@/lib/utils'
import { playerSelectTeamSchema } from '@/schemas'
import { useGetUserRegisteredTeamsQuery } from '@/services/auth'
import { useSignInTeamToEventMutation } from '@/services/events'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { QuizPlayer } from './Player'

interface Props {
  setPlayer: (arg: QuizPlayer | null) => void
  event: QuizEvent
}

export default function SelectTeam({ event, setPlayer }: Props) {
  const [selectedTeam, setSelectedTeam] = useState<ComboboxOption | null>(null)
  const [wildcardDialog, setWildcardDialog] = useState(false)
  const [fetchingSavedPlayer, setFetchingSavedPlayer] = useState(true)

  const { data: teams = [], isLoading } = useGetUserRegisteredTeamsQuery(
    event.creator._id,
    {
      refetchOnFocus: true,
    }
  )

  const [signInTeam, { isLoading: joiningEvent }] =
    useSignInTeamToEventMutation()

  const form = useForm({
    resolver: zodResolver(playerSelectTeamSchema),
    defaultValues: {
      passphrase: '',
    },
  })

  const submitPlayerJoin: SubmitHandler<{ passphrase: string }> = async ({
    passphrase,
  }) => {
    if (!selectedTeam) {
      toast.error('Select a Team')
      return
    }

    try {
      const response = await signInTeam({
        id: selectedTeam.value,
        passphrase,
      }).unwrap()

      setPlayer({
        name: response.name,
        team_id: response._id,
        avatar: response.sigil,
      })
      toast.success(`Joined Quiz Event ${event.entry_code}`)
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  const submitWildcardJoin: SubmitHandler<{ passphrase: string }> = ({
    passphrase,
  }) => {
    setPlayer({
      name: passphrase,
      team_id: '',
      avatar: '',
    })
    toast.success(`Joined Quiz Event ${event.entry_code}`)
  }

  useEffect(() => {
    const currentPlayerData = localStorage.getItem('pqa_player_game_data')
    if (currentPlayerData) {
      const player = JSON.parse(currentPlayerData)
      if (event.entry_code === player.event) {
        setPlayer(player.player)
      } else {
        localStorage.removeItem('pqa_player_game_data')
      }
    }
    setFetchingSavedPlayer(false)
  }, [])

  if (fetchingSavedPlayer) return <Loader />

  return (
    <section className=' flex-auto flex flex-col items-center justify-center relative'>
      <div className=' w-3/4 max-w-[400px] h-full pt-10 justify-between  flex flex-col gap-6 items-center'>
        <div className=' text-center'>
          <div className=' w-28 mx-auto mb-5'>
            <AppLogo />
          </div>
          <h1 className=' text-3xl font-light'>Enter Team Details</h1>
          <small className=' text-muted-foreground'>
            Search for your team and enter passphrase to continue
          </small>
        </div>
        <div className=' w-full flex flex-col flex-auto gap-8 pt-10'>
          <AppComboBox
            selected={selectedTeam}
            setSelected={setSelectedTeam}
            options={teams.map((team) => ({
              label: team.name,
              value: team._id,
            }))}
            classname='h-12'
            text='Select team'
            placeholder='Search for team...'
            loading={isLoading}
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submitPlayerJoin)}>
              <FormInput
                form={form}
                name='passphrase'
                type='password'
                placeholder='*****'
              />
              <div className=' flex flex-col gap-2 items-center justify-center'>
                <AppButton
                  type='submit'
                  text='Join'
                  classname=' mt-6 w-full mx-auto'
                  loading={joiningEvent}
                />
                <p className='text-muted-foreground text-sm text-center'>
                  Don't have a team?{' '}
                  <a
                    href={`https://${window.location.hostname}/team/reg/${event.creator._id}`}
                    target='_blank'
                    className=' font-medium text-primary'>
                    Register new team
                  </a>
                </p>
              </div>
            </form>
          </Form>

          <div className=' flex items-center gap-5'>
            <span className='flex-auto h-[1px] bg-primary'></span> OR
            <span className='flex-auto h-[1px] bg-primary'></span>
          </div>

          <AppButton
            text='Play as wildcard'
            variant='outline'
            classname=' mt-3 w-full border-primary'
            onClick={() => setWildcardDialog(true)}
          />
        </div>
      </div>

      <AppDialog
        title='Play as wildcard'
        open={wildcardDialog}
        setOpen={setWildcardDialog}>
        <p className=' text-center text-sm text-muted-foreground'>
          Wildcards is a team of players with no teams. They partake in events
          like everyone in a team. Wildcards scores can only be used at a single
          game and would not be available in an alltime leaderboard.{' '}
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitWildcardJoin)}>
            <FormInput
              form={form}
              name='passphrase'
              label='Player name'
              type='text'
              placeholder='John Doe'
            />
            <div className=' flex flex-col gap-2 items-center justify-center'>
              <AppButton
                type='submit'
                text='Join as wildcard'
                classname=' mt-6 w-full mx-auto'
              />
            </div>
          </form>
        </Form>
      </AppDialog>
    </section>
  )
}

import { sigils } from '@/assets/sigils'
import AppButton from '@/components/AppButton'
import AppLogo from '@/components/AppLogo'
import FormInput from '@/components/FormInput'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { playerGameActions } from '@/redux/player'
import { useAppDisPatch } from '@/redux/store'
import { playerJoinSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'

type PlayerDetailsForm = z.infer<typeof playerJoinSchema>

function PlayerDetails({
  playerId,
  roomCode,
}: {
  playerId: string
  roomCode: string
}) {
  const dispatch = useAppDisPatch()
  const form = useForm<PlayerDetailsForm>({
    resolver: zodResolver(playerJoinSchema),
    defaultValues: {
      name: '',
      avatar: 'targaryen',
      gameId: playerId,
    },
  })

  const sigilOptions = Object.keys(sigils).map((key) => key)

  const handlePlayerDataSubmit: SubmitHandler<PlayerDetailsForm> = (data) => {
    console.log(data)
    const player = {
      name: data.name,
      avatar_url: data.avatar,
      gameId: data.gameId,
    }
    dispatch(playerGameActions.updatePlayerInfo(player))

    localStorage.setItem(
      'saved_game_player',
      JSON.stringify({
        roomCode,
        player,
      })
    )
  }

  console.log(form.formState.errors)

  useEffect(() => {
    const storedGameData = localStorage.getItem('saved_game_player')

    if (storedGameData) {
      const data = JSON.parse(storedGameData)
      if (roomCode === data.roomCode) {
        form.reset({
          name: data.player.name,
          avatar: data.player.avatar || 'targaryen',
          gameId: data.player.gameId || playerId,
        })
      } else {
        localStorage.removeItem('saved_game_player')
      }
    }
  }, [])

  return (
    <section className=' h-screen flex flex-col items-center justify-center relative overflow-hidden'>
      <div className=' w-3/4 max-w-[400px] h-full pt-20 justify-around  flex flex-col gap-6 items-center overflow-hidden'>
        <div className=' text-center'>
          <div className=' w-28 mx-auto mb-5'>
            <AppLogo />
          </div>
          <h1 className=' text-3xl font-light'>Player/Team Details</h1>
          <small className=' text-muted-foreground'>
            Enter Your Name or Team Name to Join The Quiz
          </small>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handlePlayerDataSubmit)}
            className=' w-full  flex flex-col gap-5 overflow-hidden'>
            <FormField
              name='avatar'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Player/Team Sigil</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue={field.value}
                      className='flex gap-3 py-4 space-y-1 items-center overflow-auto'
                      onValueChange={field.onChange}>
                      {sigilOptions.map((sigil) => (
                        <FormItem
                          key={sigil}
                          className=' flex flex-col-reverse gap-2 items-center'>
                          <FormControl>
                            <RadioGroupItem value={sigil} />
                          </FormControl>
                          <FormLabel className=' cursor-pointer'>
                            <div className='flex items-center gap-2 w-20 h-20'>
                              <img
                                src={sigils[sigil]}
                                alt={sigil}
                                className='w-full h-full object-contain'
                              />
                            </div>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            {/* {errorMessage && (
              <ErrorMessage
                title={errorMessage.title}
                variant='destructive'
                description={errorMessage.desc}
              />
            )} */}
            <FormInput
              form={form}
              name='name'
              label='Player/Team Name'
              type='text'
              placeholder='Enter your name or team name'
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
        <small className=' text-muted-foreground  text-xs max-w-[300px] text-center'></small>
      </div>
    </section>
  )
}

export default PlayerDetails

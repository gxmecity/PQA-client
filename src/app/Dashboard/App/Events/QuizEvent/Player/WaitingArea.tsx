import { sigils } from '@/assets/sigils'
import AppAvater from '@/components/AppAvater'
import AppLogo from '@/components/AppLogo'
import { Player } from '@/redux/player'

interface Props {
  player: Player
}

function WaitingArea({ player }: Props) {
  return (
    <section className=' h-screen flex flex-col items-center justify-center relative overflow-hidden'>
      <div className=' w-3/4 max-w-[400px] h-full pt-20 justify-around  flex flex-col gap-6 items-center overflow-hidden'>
        <div className=' text-center'>
          <div className=' w-28 mx-auto mb-5'>
            <AppLogo />
          </div>
          <h1 className=' text-3xl font-light animate-pulse'>
            Waiting for Quiz to Start
          </h1>
          <small className=' text-muted-foreground'>
            Please wait for the host to begin the quiz
          </small>
        </div>
        <div className=' grid place-items-center gap-5 '>
          <AppAvater
            fallbackText={player.name}
            img_url={sigils[player.avatar_url ?? '']}
            classname=' !h-20 !w-20'
          />
          <h1 className=' text-3xl font-light animate-pulse'>{player.name}</h1>
        </div>

        <small className=' text-muted-foreground  text-xs max-w-[300px] text-center'></small>
      </div>
    </section>
  )
}

export default WaitingArea

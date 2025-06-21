import AppButton from '@/components/AppButton'
import { GameRound } from '@/redux/game'
import { PlayIcon } from 'lucide-react'

interface Props {
  round: GameRound
  gameMode?: string
  handlePublish: (arg0: any, arg1?: any) => void
  timer: number
}

function RoundIntro({ round, gameMode, timer, handlePublish }: Props) {
  const { index, totalQuestions, time, title, type } = round

  return (
    <section className=' h-full px-5 py-5 w-full max-w-5xl'>
      <h1 className=' text-game text-3xl font-bold text-center'>
        Round {index + 1}
      </h1>
      <h3 className='text-center text-xl font-medium mt-2'>{title}</h3>
      <div className=' my-10 text-muted-foreground'>
        <p>{totalQuestions} Questions</p>
        <p>Questions Duration: {time}secs</p>
        <p>Round Type: {type === 'trivia' ? 'Trivia' : "Dealer's choice"} </p>
      </div>
      <div className=' mb-20'>
        <h3 className=' text-xl font-semibold'>Description</h3>
        <p className=' text-xs italic text-muted-foreground mb-10'>
          Read this out to your audience
        </p>
        {type === 'trivia' ? (
          <p>
            This round is a trivia round. You will be asked questions of
            different types: multiple choice, true or false or open questions in
            quick succession.{' '}
            {gameMode === 'online' &&
              `Submit your answer using your logged in device.
            Remember, the quicker you answer, the more points you get.`}{' '}
            All answers are revealed at the end of this round.
          </p>
        ) : (
          <p>
            This round is a dealer's choice round. Players will take turns in
            picking questions from the available options. The quiz master
            decides the order in which teams/players pick their numbers and
            awards points to the player if question is answered correctly. If
            the player fails to answer correctly, the question becomes available
            for other players to answer as a bonus. Bonus answers attracts 50%
            of question points. Use your logged in device to request for bonus
            points.
          </p>
        )}
      </div>
      <div className=' flex gap-5 items-center flex-wrap'>
        <AppButton
          text='Start Round'
          classname=' h-12  font-bold w-full max-w-[150px]  text-game border-game'
          variant='outline'
          disabled={timer > 0}
          icon={<PlayIcon />}
          onClick={() => handlePublish('start-round')}
        />
        <AppButton
          text='Skip Round'
          icon={
            <span className='border-r border-r-game flex items-center'>
              <PlayIcon />
            </span>
          }
          disabled={timer > 0}
          classname=' h-12 font-bold w-full max-w-[150px]  text-game '
          variant='ghost'
          onClick={() => handlePublish('next-round')}
        />
      </div>
    </section>
  )
}

export default RoundIntro

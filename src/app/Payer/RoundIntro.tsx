import { PlayerRound } from './Game'

interface Props {
  round: PlayerRound
}

export default function RoundIntro({ round }: Props) {
  return (
    <section className=' h-full px-5 py-5 w-full max-w-5xl'>
      <h1 className=' text-primary text-3xl font-bold text-center'>
        Round {round.index + 1}
      </h1>
      <h3 className='text-center text-xl font-medium mt-2'>{round.title}</h3>
      <div className=' my-10 text-muted-foreground'>
        <p>Questions Duration: {round.time}secs</p>
        <p className=' capitalize'>
          Round Type: {round.type.replace('_', ' ')}{' '}
        </p>
      </div>
      {round.type === 'trivia' ? (
        <div className=' mb-20'>
          <h3 className=' text-xl font-semibold'>Description</h3>

          <p>
            This round is a trivia round. You will be asked questions of
            different types: multiple choice, true or false or open questions.
            Submit your answer using this device. Remember, the quicker you
            answer, the more points you get.
          </p>
        </div>
      ) : (
        <div className=' mb-20'>
          <h3 className=' text-xl font-semibold'>Description</h3>

          <p>
            This round is a dealer's choice round. Teams/players will take turns
            in picking questions from the available options. The quiz master
            decides the order in which teams/players pick their numbers and
            awards points to the team/player if question is answered correctly.
            If the team/player fails to answer correctly, the question becomes
            available for other players to answer as a bonus. Bonus answers
            attracts 50% of question points. Use this device to request for a
            bonus question when timer elapses
          </p>
        </div>
      )}
    </section>
  )
}

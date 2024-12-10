import AppButton from '@/components/AppButton'
import { cn } from '@/lib/utils'
import { DealersChoiceProps } from '../Dashboard/App/Events/Game/Rounds/Dealers'
import { Button } from '@/components/ui/button'

type Props = Omit<DealersChoiceProps, 'startTimerFunction' | 'roomChannel'>

export default function Dealers({
  activeQuestionIndex,
  round,
  roundindex,
  revealAnswer,
  isLastRound,
  hostChannel,
  started,
  seconds,
  ended,
  scores,
  bonusLineup,
  dealingTeams,
  answeredQuestions,
}: Props) {
  const selectQuestion = async (arg: number) => {
    await hostChannel.publish('set-question-index', {
      questionIndex: arg,
      activeRound: roundindex,
    })
  }

  const goToNextRound = () => {
    if (isLastRound) {
      hostChannel.publish('final-result', '')
    } else {
      hostChannel.publish('next-round', {
        activeRound: roundindex,
      })
    }
  }

  const goToNextQuestion = () => {
    if (
      activeQuestionIndex &&
      round.questions[activeQuestionIndex].question.question_type ===
        'question_only'
    ) {
      hostChannel.publish('set-question-index', {
        questionIndex: null,
        activeRound: roundindex,
      })
    } else if (revealAnswer) {
      hostChannel.publish('set-question-index', {
        questionIndex: null,
        activeRound: roundindex,
      })
    } else {
      hostChannel.publish('reveal-answer', {
        activeRound: roundindex,
        activeQuestion: activeQuestionIndex,
      })
    }
  }

  const awardPointToPlayer = async (
    playerId: string,
    isBonus: boolean,
    team_id?: string
  ) => {
    await hostChannel.publish('award-point', {
      playerId,
      isBonus,
      activeRound: roundindex,
      team_id,
    })

    hostChannel.publish('reveal-answer', {
      activeRound: roundindex,
      activeQuestion: activeQuestionIndex,
    })
  }

  const activeQuestion =
    activeQuestionIndex !== null
      ? round.questions[activeQuestionIndex]
      : undefined

  const roundLeaderboard = scores[`round-${roundindex}`]

  const roundScores = Object.keys(roundLeaderboard).map(
    (item) => roundLeaderboard[item]
  )

  if (ended)
    return (
      <section className=' h-full overflow-auto px-5 py-5 w-full max-w-5xl'>
        <h1 className=' text-primary text-3xl font-bold text-center'>
          Round {roundindex + 1}
        </h1>
        <h3 className='text-center text-xl font-medium mt-2'>
          {round.round_name}
        </h3>
        <div className=' my-10 text-muted-foreground'>
          <p>{round.questions.length} Questions</p>
          <p>Round Type: Dealer's Choice </p>
        </div>
        <AppButton
          text={isLastRound ? 'Final Scores' : 'Next Round'}
          onClick={goToNextRound}
          classname=' h-12 mb-8 font-bold w-full max-w-[200px] text-primary border-primary'
          variant='outline'
        />

        <div>
          <h3 className='text-xl font-semibold'>Standings</h3>
          <div className=' mt-5'>
            {roundScores
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div
                  key={index}
                  className=' flex items-center gap-5 h-14  px-2 border border-border'>
                  <span>{index + 1}</span>
                  <span className=' flex-auto flex items-center pl-2 truncate border-x border-x-border h-full'>
                    {player.name}
                  </span>
                  <span className=' ml-auto'>{player.score}pts</span>
                </div>
              ))}
          </div>
        </div>
      </section>
    )

  if (!started)
    return (
      <section className=' h-full px-5 py-5 w-full max-w-5xl'>
        <h1 className=' text-primary text-3xl font-bold text-center'>
          Round {roundindex + 1}
        </h1>
        <h3 className='text-center text-xl font-medium mt-2'>
          {round.round_name}
        </h3>
        <div className=' my-10 text-muted-foreground'>
          <p>{round.questions.length} Questions</p>
          <p>Questions Duration: {round.timer}secs</p>
          <p>Round Type: Dealer's choice </p>
        </div>{' '}
        <div className=' mb-20'>
          <h3 className=' text-xl font-semibold'>Description</h3>
          <p className=' text-xs italic text-muted-foreground mb-10'>
            Read this out to your audience
          </p>
          <p>
            This round is a dealer's choice round. Teams/players will take turns
            in picking questions from the available options. The quiz master
            decides the order in which teams/players pick their numbers and
            awards points to the team/player if question is answered correctly.
            If the team/player fails to answer correctly, the question becomes
            available for other players to answer as a bonus. Bonus answers
            attracts 50% of question points.
          </p>
        </div>
        <AppButton
          text='Start Round'
          classname=' h-12 mt-8 font-bold w-full max-w-[200px] mx-auto flex text-primary border-primary'
          variant='outline'
          onClick={() => {
            hostChannel.publish('start-round', {
              activeRound: roundindex,
            })
          }}
        />
      </section>
    )

  if (activeQuestionIndex === null)
    return (
      <section className=' h-full px-5 py-5 w-full max-w-5xl overflow-auto'>
        <h1 className=' text-primary text-3xl font-bold text-center'>
          Select a Question
        </h1>

        <div className=' my-5 text-muted-foreground'>
          <p>Questions Duration: {round.timer}secs</p>
        </div>

        <p className=' text-muted-foreground mb-5'>
          Ask a team/player what number they want to answer. Select the number
          they choose. Team list is visible on your main screen.{' '}
        </p>

        <div className=' mb-20 flex flex-wrap gap-3 justify-center'>
          {Array.from({ length: round.questions.length }).map((_, index) => (
            <button
              key={index}
              disabled={answeredQuestions.includes(index)}
              onClick={() => selectQuestion(index)}
              className={cn(
                ' h-10 w-10 flex items-center justify-center text-lg font-semibold rounded-md ',
                answeredQuestions.includes(index)
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-primary text-black '
              )}>
              {index + 1}
            </button>
          ))}
        </div>

        <AppButton
          text='End Round'
          classname=' h-12 mt-8 font-bold w-full max-w-[200px] mx-auto flex text-primary border-primary'
          variant='outline'
          onClick={() => {
            hostChannel.publish('end-round', {})
          }}
        />
      </section>
    )

  return (
    <section className=' h-full px-5 py-5 w-full max-w-5xl overflow-auto'>
      <h1 className=' text-primary text-3xl font-bold text-center'>
        Question {activeQuestionIndex + 1}
      </h1>
      <h3 className='text-center text-lg text-muted-foreground font-medium mt-2'>
        {round.round_name}
      </h3>

      <div className=' mb-10'>
        <h3 className=' text-xl font-semibold'>Question</h3>
        <p>{activeQuestion?.question.question_text}</p>
      </div>
      <div className=' mb-10'>
        <h3 className=' text-xl font-semibold'>Correct Answer</h3>
        <p>{activeQuestion?.answer.answer_text}</p>
      </div>

      {!revealAnswer && (
        <>
          <div className=' mb-5'>
            <p className=' mb-2 font-medium'>Point To: </p>
            <div className=' flex gap-3 flex-wrap'>
              {dealingTeams.map((team, index) => (
                <Button
                  disabled={seconds > 0}
                  key={index}
                  onClick={() =>
                    awardPointToPlayer(team.clientId, false, team.team_id)
                  }
                  className=' border border-primary px-3 py-2 rounded-md'>
                  {team.name}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className=' mb-2 font-medium'>Bonus To: </p>
            <div className=' flex gap-3 flex-wrap'>
              {bonusLineup.map((team, index) => (
                <Button
                  key={index}
                  disabled={seconds > 0}
                  onClick={() =>
                    awardPointToPlayer(team.clientId, true, team.team_id)
                  }
                  className=' border border-primary px-3 py-2 rounded-md'>
                  {team.name}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      <AppButton
        text={!revealAnswer ? 'Reveal answer' : 'Next Question'}
        disabled={seconds > 0}
        classname=' h-12 mt-8 font-bold w-full max-w-[200px] mx-auto flex text-primary border-primary'
        variant='outline'
        onClick={goToNextQuestion}
      />
    </section>
  )
}

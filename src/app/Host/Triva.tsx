import AppButton from '@/components/AppButton'
import { TriviaProps } from '../Dashboard/App/Events/Game/Rounds/Trivia'

type Props = Omit<TriviaProps, 'startTimerFunction'>

export default function Triva({
  activeQuestionIndex,
  round,
  roundindex,
  hostChannel,
  started,
  ended,
  scores,
  seconds,
  starting,
  isLastRound,
  canRevealAnswer,
  isLastQuestion,
  revealAnswer,
}: Props) {
  const goToNextQuestion = () => {
    if (seconds) return

    if (isLastQuestion) {
      if (!canRevealAnswer) {
        hostChannel.publish('start-answer-reveal', '')
      } else if (!revealAnswer) {
        hostChannel.publish('reveal-answer', {
          activeRound: roundindex,
          activeQuestion: activeQuestionIndex,
        })
      } else {
        hostChannel.publish('end-round', {})
      }
    } else {
      if (canRevealAnswer && !revealAnswer) {
        hostChannel.publish('reveal-answer', {
          activeRound: roundindex,
          activeQuestion: activeQuestionIndex,
        })
      } else {
        hostChannel.publish('next-question', {
          activeQuestion: activeQuestionIndex,
          activeRound: roundindex,
        })
      }
    }
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

  const roundLeaderboard = scores.find(
    (round) => round.round === roundindex
  ) ?? {
    round: roundindex,
    leaderboard: {},
  }

  const activeQuestion = round.questions[activeQuestionIndex]
  console.log(seconds)

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
          <p>Round Type: Trivia </p>
        </div>
        <AppButton
          text={isLastRound ? 'Final Scores' : 'Next Round'}
          classname=' h-12 mb-8 font-bold w-full max-w-[200px] text-primary border-primary'
          onClick={goToNextRound}
          variant='outline'
        />

        <div>
          <h3 className='text-xl font-semibold'>Standings</h3>
          <div className=' mt-5'>
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className=' flex items-center gap-5 h-14  px-2 border border-border'>
                <span>{index + 1}</span>
                <span className=' flex-auto flex items-center pl-2 truncate border-x border-x-border h-full'>
                  We Know Nothing
                </span>
                <span className=' ml-auto'>10pts</span>
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
        <h3 className='text-center text-xl font-medium mt-2'>Trivia Round</h3>
        <div className=' my-10 text-muted-foreground'>
          <p>{round.questions.length} Questions</p>
          <p>Questions Duration: {round.timer}secs</p>
          <p>Round Type: Trivia </p>
        </div>

        {starting ? (
          <div className=' flex flex-col items-center justify-center gap-3 mt-20'>
            <p className='font-semibold text-xl'>Game is starting in</p>
            <h1 className='font-bold text-7xl text-primary'>{seconds}</h1>
            <p className='font-medium text-lg'>Please wait...</p>
          </div>
        ) : (
          <>
            {' '}
            <div className=' mb-20'>
              <h3 className=' text-xl font-semibold'>Description</h3>
              <p className=' text-xs italic text-muted-foreground mb-10'>
                Read this out to your audience
              </p>
              <p>
                This round is a trivia round. You will be asked{' '}
                {round.questions.length} questions of different types: multiple
                choice, true or false or open questions. Submit your answer
                using your logged in device. Remember, the quicker you answer,
                the more points you get.
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
          </>
        )}
      </section>
    )

  return (
    <section className=' h-full px-5 py-5 w-full max-w-5xl'>
      <h1 className=' text-primary text-3xl font-bold text-center'>
        Question {activeQuestionIndex + 1}
      </h1>
      <h3 className='text-center text-lg text-muted-foreground font-medium mt-2'>
        {round.round_name}
      </h3>
      <div className=' my-10 text-muted-foreground'>
        <p>Questions Duration: {round.timer}secs</p>
        <p>Question Type: {activeQuestion.question.question_type} </p>
      </div>

      <div className=' mb-20'>
        <h3 className=' text-xl font-semibold'>Question</h3>
        <p>Who Killed Delegiwa?</p>

        <ul className=' mt-6 list-disc px-5 space-y-2'>
          <li>Babangida</li>
          <li>Obasanjo</li>
          <li>Atiku</li>
          <li>MGK</li>
        </ul>
      </div>
      <div className=' mb-10'>
        <h3 className=' text-xl font-semibold'>Correct Answer</h3>
        <p>Babangida</p>
      </div>
      <AppButton
        disabled={seconds > 0}
        text={
          isLastQuestion && !canRevealAnswer
            ? 'Start Answer Reveal'
            : isLastQuestion && revealAnswer
              ? 'End Round'
              : canRevealAnswer && !revealAnswer
                ? 'Reveal Answer'
                : 'Next Question'
        }
        classname=' h-12 mt-8 font-bold w-full max-w-[200px] mx-auto flex text-primary border-primary'
        variant='outline'
        onClick={goToNextQuestion}
      />
    </section>
  )
}

import AppButton from '@/components/AppButton'
import EmptyState from '@/components/EmptyState'
import { cn } from '@/lib/utils'
import { useAppSelector } from '@/redux/store'
import { EyeOpenIcon, ReloadIcon } from '@radix-ui/react-icons'
import { RealtimeChannel } from 'ably'
import { ArrowRight, Bell, CircleX, EyeClosedIcon, User2 } from 'lucide-react'
import { useMemo } from 'react'
import RoundIntro from './RoundIntro'

interface Props {
  timer: number
  questionTimer: number
  hostChannel: RealtimeChannel
  gameMode?: string
}

function GameRound({ hostChannel, timer, questionTimer, gameMode }: Props) {
  const {
    round,
    question,
    answeredQuestions,
    canRevealAnswer,
    isRevealAnswer,
    dealer_index,
    totalPlayers,
  } = useAppSelector((state) => state.game)

  const handlePublish = (event: string, data: Record<string, any> = {}) =>
    hostChannel.publish(event, data)

  const iconClassName = 'text-game !h-10 !w-10'
  const buttonClassName = ' flex flex-col gap-2 text-xs !h-auto'

  const controls = useMemo(() => {
    if (!round) return null

    const { round_ended, type } = round
    const isTrivia = type === 'trivia'
    const canEndRound = isTrivia ? question?.isLast : true

    return (
      <div className=' p-5'>
        <h3 className=' font-bold text-game-foreground'>Quiz Controls:</h3>
        <div className=' grid grid-cols-3 gap-4 mt-10 p-2'>
          <AppButton
            onClick={() => handlePublish('end-round')}
            disabled={!canEndRound || round_ended || questionTimer > 0}
            classname={buttonClassName}
            variant='ghost'
            text='End Round'
            icon={<CircleX size={40} className={iconClassName} />}
          />

          {isTrivia && (
            <AppButton
              disabled={
                questionTimer > 0 || (question && !question.isLast)
                  ? true
                  : false
              }
              onClick={() => handlePublish('restart-round')}
              classname={buttonClassName}
              variant={'ghost'}
              text='Restart Round'
              icon={<ReloadIcon className={iconClassName} />}
            />
          )}

          {!isTrivia && !question && (
            <AppButton
              disabled={totalPlayers.length < 2}
              classname={buttonClassName}
              onClick={() =>
                handlePublish('set-question-index', { index: null })
              }
              variant='ghost'
              text='Next Dealer'
              icon={<User2 className={iconClassName} />}
            />
          )}

          {question && (
            <>
              <AppButton
                onClick={() =>
                  isTrivia
                    ? handlePublish('next-question')
                    : handlePublish('set-question-index', { index: null })
                }
                disabled={(question.isLast && isTrivia) || questionTimer > 0}
                classname={buttonClassName}
                variant='ghost'
                icon={<ArrowRight className={iconClassName} />}
                text='Next Question'
              />

              {question.isLast && isTrivia && !canRevealAnswer && (
                <AppButton
                  onClick={() => handlePublish('start-answer-reveal')}
                  disabled={questionTimer > 0}
                  classname={buttonClassName}
                  variant='ghost'
                  icon={<EyeClosedIcon className={iconClassName} />}
                  text=' Start Answer Reveal'
                />
              )}
              {!isTrivia && (
                <AppButton
                  onClick={() => handlePublish('allow-buzzer')}
                  disabled={questionTimer > 0 || isRevealAnswer}
                  classname={buttonClassName}
                  variant='ghost'
                  icon={<Bell className={iconClassName} />}
                  text=' Open Buzzer'
                />
              )}

              <AppButton
                disabled={
                  !canRevealAnswer ||
                  isRevealAnswer ||
                  question?.question?.question.question_type === 'question_only'
                }
                onClick={() => handlePublish('reveal-answer')}
                classname={buttonClassName}
                variant='ghost'
                text='Reveal Answer'
                icon={<EyeOpenIcon className={iconClassName} />}
              />
            </>
          )}
        </div>
      </div>
    )
  }, [
    round,
    question,
    answeredQuestions,
    canRevealAnswer,
    isRevealAnswer,
    handlePublish,
  ])

  if (!round)
    return (
      <div className='h-full animate-pulse'>
        <EmptyState
          title='Waiting for Next Round....'
          description='Hold on while we fetch the next round...'
        />
      </div>
    )

  if (!round.round_started)
    return (
      <RoundIntro
        round={round}
        gameMode={gameMode}
        handlePublish={handlePublish}
        timer={timer}
      />
    )

  if (round.round_started && !question)
    return (
      <>
        {round.type === 'dealers_choice' ? (
          <section className=' h-full w-full max-w-5xl overflow-auto flex flex-col'>
            <div className=' px-5 pt-5'>
              <h1 className=' text-game-foreground  font-bold text-center'>
                Round {round.index + 1}
              </h1>
              <h3 className='text-center font-medium mt-2'>{round.title}</h3>
            </div>

            <h1 className=' text-primary text-3xl font-bold text-center'>
              Select a Question
            </h1>

            <div className=' my-5 text-muted-foreground px-5'>
              <p>Questions Duration: {round.time}secs</p>
            </div>

            <p className=' text-muted-foreground mb-5 px-5'>
              Ask{' '}
              {totalPlayers[dealer_index]
                ? totalPlayers[dealer_index].name
                : 'a player'}{' '}
              what number they want to answer. Select the number they choose.
              Player list is visible on your main screen.{' '}
            </p>

            {!timer ? (
              <>
                <div className=' mb-20 flex-1 px-5'>
                  {Array.from({ length: round.totalQuestions }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handlePublish('set-question-index', { index })
                        }
                        disabled={answeredQuestions.includes(index)}
                        className={cn(
                          ' h-10 w-10 inline-flex mr-3 mb-3 items-center justify-center text-lg font-semibold rounded-md ',
                          answeredQuestions.includes(index)
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-primary text-black '
                        )}>
                        {index + 1}
                      </button>
                    )
                  )}
                </div>

                <div className='  bg-game-background'>{controls}</div>
              </>
            ) : (
              <div className=' flex flex-col items-center justify-center gap-3 mt-20'>
                <h1 className='font-bold text-7xl text-primary'>{timer}</h1>
                <p className='font-medium text-lg'>Please wait...</p>
              </div>
            )}
          </section>
        ) : (
          <div className=' h-full animate-pulse'>
            <EmptyState
              title='Waiting for Question...'
              description='Hold on while we fetch the next question'
            />
          </div>
        )}
      </>
    )

  return (
    <section className=' h-full w-full max-w-5xl mx-auto overflow-auto flex flex-col'>
      <div className=' flex-1 flex flex-col gap-6 p-5'>
        <div>
          <h1 className=' text-game-foreground  text-center'>
            Round {round.index + 1}
          </h1>
          <h1 className=' text-game text-3xl font-bold text-center'>
            Question {question!.index + 1}
          </h1>
          <h3 className='text-center text-lg text-muted-foreground font-medium mt-2'>
            {round.title}
          </h3>
        </div>

        <div className=' mb-10'>
          <h3 className=' text-xl font-semibold text-game'>Question</h3>
          <p>{question!.question.question.question_text}</p>
          {question!.question.question.question_type === 'multiple_choice' &&
            question!.question.question.multi_choice_options?.length && (
              <ul className=' mt-6 list-disc px-5 space-y-2'>
                {question!.question.question.multi_choice_options.map(
                  (option, index) => (
                    <li key={index}>{option}</li>
                  )
                )}
              </ul>
            )}
        </div>
        <div className=' mb-10'>
          <h3 className=' text-xl font-semibold text-game'>Correct Answer</h3>
          <p>{question!.question.answer.answer_text}</p>
        </div>
      </div>
      <div className='  bg-game-background'>{controls}</div>
    </section>
  )
}

export default GameRound

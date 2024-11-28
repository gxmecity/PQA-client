import AppButton from '@/components/AppButton'
import CircularProgress from '@/components/CircularProgress'
import FormInput from '@/components/FormInput'
import { Form } from '@/components/ui/form'
import { playerSelectTeamSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PlayerRound } from './Game'

interface Props {
  round: PlayerRound
  question: Question
  seconds: number
  submitAnswer: (arg: string) => void
}

export default function Trivia({
  round,
  question,
  seconds,
  submitAnswer,
}: Props) {
  const [allowAnswer, setallowAnswer] = useState<boolean>(true)

  const handleAnswerSubmit = (ans: string) => {
    setallowAnswer(false)
    submitAnswer(ans)
  }
  const openAnsweForm = useForm({
    resolver: zodResolver(playerSelectTeamSchema),
    defaultValues: {
      passphrase: '',
    },
  })

  const openAnswerSubmit: SubmitHandler<{ passphrase: string }> = async ({
    passphrase,
  }) => {
    handleAnswerSubmit(passphrase)
  }

  useEffect(() => {
    setallowAnswer(true)
  }, [question])

  useEffect(() => {
    if (seconds < 1) {
      setallowAnswer(false)
    }
  }, [seconds])

  return (
    <div className=' h-full w-full flex gap-10 flex-col pt-2  pb-5'>
      <div>
        <h1 className='text-2xl'>{question.question_text}</h1>
        {question.question_media?.type === 'image' && (
          <div className=' w-full h-32'>
            <img src='' className='h-full object-contain' alt='' />
          </div>
        )}
        {question.question_media?.type === 'video' && (
          <p className='text-muted-foreground'>
            Look at the main screen to see your question.
          </p>
        )}
      </div>

      {allowAnswer ? (
        <div>
          <div className=' flex flex-col gap-3'>
            {question.question_type === 'multiple_choice' &&
              question.multi_choice_options?.length && (
                <>
                  {question.multi_choice_options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSubmit(option)}
                      className=' h-12 border border-border rounded-md text-start px-5 capitalize'>
                      {option}
                    </button>
                  ))}
                </>
              )}
            {question.question_type === 'true_or_false' && (
              <>
                <button
                  className=' h-12 border border-border rounded-md text-start px-5
                '
                  onClick={() => handleAnswerSubmit('true')}>
                  True
                </button>
                <button
                  className=' h-12 border border-border rounded-md text-start px-5'
                  onClick={() => handleAnswerSubmit('false')}>
                  False
                </button>
              </>
            )}

            {question.question_type === 'open_question' && (
              <Form {...openAnsweForm}>
                <form
                  className=' flex flex-col gap-4'
                  onSubmit={openAnsweForm.handleSubmit(openAnswerSubmit)}>
                  <FormInput
                    form={openAnsweForm}
                    name='passphrase'
                    type='text'
                    placeholder='your answer here...'
                  />
                  <AppButton
                    text='Submit'
                    type='submit'
                    classname='w-max mx-auto'
                    disabled={!allowAnswer}
                  />
                </form>
              </Form>
            )}
          </div>
        </div>
      ) : (
        <div className=' flex-auto flex items-center justify-center flex-col'>
          <p>Answer submitted.</p>
          <small className='text-muted-foreground'>
            waiting for next question...
          </small>
        </div>
      )}
      {seconds > 0 && (
        <CircularProgress
          value={seconds}
          total={round.time}
          color='#ffce1f'
          sizeClassname=' size-24 text-xl mt-auto ml-auto'
        />
      )}
    </div>
  )
}

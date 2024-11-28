import AppButton from '@/components/AppButton'
import CircularProgress from '@/components/CircularProgress'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { PlayerRound } from './Game'
import { RealtimeChannel } from 'ably'
import { Form } from '@/components/ui/form'

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
    submitAnswer(ans)
    setallowAnswer(false)
  }

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

      {allowAnswer && (
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
              <>
                <Input className=' h-12' placeholder='your answer here...' />
                <AppButton text='Submit' classname='w-max mx-auto' />
              </>
            )}
          </div>
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

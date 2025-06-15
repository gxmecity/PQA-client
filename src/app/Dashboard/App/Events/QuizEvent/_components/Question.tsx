import blackbox from '@/assets/Black Box PQT.png'
import CircularProgress from '@/components/CircularProgress'
import { GameQuestion } from '@/redux/game'
import { useEffect } from 'react'

interface Props {
  data: GameQuestion
  revealAnswer: boolean
  onQuestionLoaded: () => void
  timer: number
  questionTime: number
}

function Question({
  data,
  revealAnswer,
  onQuestionLoaded,
  timer,
  questionTime,
}: Props) {
  const {
    question: { question, answer },
    index,
  } = data

  useEffect(() => {
    onQuestionLoaded()
  }, [data])

  if (revealAnswer)
    return (
      <div className=' h-full flex flex-col items-center justify-center'>
        <p className=' text-2xl font-bold text-game-foreground'>Answer:</p>
        <h1 className=' dharma-gothic-heavy text-[6.5rem] gd-text-game'>
          {answer.answer_text}
        </h1>
        {answer.is_blackbox && (
          <span className=' h-32 w-32 absolute bottom-0 right-16 shadow-2xl'>
            <img src={blackbox} alt='blackbox' />
          </span>
        )}
      </div>
    )

  if (question.standalone_media)
    return (
      <div className=' absolute top-0 left-0 bg-black h-full w-full'>
        {question.question_media?.type === 'video' && (
          <video
            style={{ width: '100%', height: '100%' }}
            playsInline
            controls={false}
            src={question.question_media.url}
          />
        )}
        {question.question_media?.type === 'image' && (
          <img
            src={question.question_media.url}
            alt='question image'
            className=' w-full h-full object-cover'
          />
        )}
      </div>
    )

  return (
    <div className=' h-full flex flex-col items-start justify-center overflow-auto'>
      <div className=' flex gap-2 items-center flex-auto overflow-auto'>
        <div className='flex-1 h-full overflow-auto grid place-items-center'>
          <div>
            <p className=' text-2xl font-bold text-game-foreground w-full '>
              Question {index + 1}
            </p>
            <h1 className=' dharma-gothic-heavy text-[6rem] gd-text-game w-full'>
              {question.question_text}
            </h1>
            {question.question_type === 'multiple_choice' && (
              <div>
                {question.multi_choice_options?.map(
                  (item, idx) =>
                    item && (
                      <div key={idx} className=''>
                        {item}
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        </div>
        {question.question_media?.url && (
          <div className='flex-1 h-full'>
            {question.question_media?.type === 'video' && (
              <video
                style={{ width: '100%', height: '100%' }}
                playsInline
                controls={false}
                src={question.question_media.url}
              />
            )}
            {question.question_media?.type === 'image' && (
              <img
                src={question.question_media.url}
                alt='question image'
                className=' w-full h-full object-cover'
              />
            )}
          </div>
        )}
      </div>
      <div className=' absolute bottom-20 right-10'>
        <CircularProgress value={timer} total={questionTime} />
      </div>
    </div>
  )
}

export default Question

import { cn } from '@/lib/utils'

interface Props {
  handleSelectQuestion: (index: number) => void
  totalQuestions: number
  answeredQuestions: number[]
}

function DealersChoice({
  handleSelectQuestion,
  totalQuestions,
  answeredQuestions,
}: Props) {
  return (
    <div className=' h-full flex w-full flex-col justify-start px-1'>
      <div className='  h-full w-full  gap-4 grid grid-cols-10 place-items-center '>
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <button
            type='button'
            onClick={() => handleSelectQuestion(index)}
            key={index}
            className={cn(
              'w-24 h-24 dharma-gothic text-7xl  rounded-full grid place-items-center bg-gradient-to-tr from-game/50 to-game ',
              answeredQuestions.includes(index) && ' opacity-20'
            )}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DealersChoice

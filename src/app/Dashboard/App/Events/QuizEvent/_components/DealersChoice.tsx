import { cn } from '@/lib/utils'
import { Player } from '@/redux/game'

interface Props {
  handleSelectQuestion: (index: number) => void
  totalQuestions: number
  answeredQuestions: number[]
  dealer?: Player
}

function DealersChoice({
  handleSelectQuestion,
  totalQuestions,
  answeredQuestions,
  dealer,
}: Props) {
  return (
    <div className=' h-full flex w-full flex-col justify-start px-1'>
      {dealer && (
        <div className=' flex items-center justify-center'>
          <p className=' font-bold text-game text-xl'>
            <span className=' font-medium text-game-foreground'>
              Next turn:{' '}
            </span>
            {dealer.name}
          </p>
        </div>
      )}

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

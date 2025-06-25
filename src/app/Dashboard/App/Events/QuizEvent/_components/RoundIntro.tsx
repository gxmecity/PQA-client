interface RoundIntroProps {
  index: number
  title: string
}

function RoundIntro({ index, title }: RoundIntroProps) {
  return (
    <div className='h-full flex items-center justify-center '>
      <div className=' h-56 bg-game-background flex justify-around items-center w-full gap-5 px-10 max-w-6xl dharma-gothic-bold '>
        <h1 className='gd-text-game  text-7xl w-max'>Round {index}</h1>
        <span className=' h-[2px] bg-gradient-to-tr from-white to-game flex-auto'></span>
        <h1 className='gd-text-game text-7xl truncate max-w-[60%]'>{title}</h1>
      </div>
    </div>
  )
}

export default RoundIntro

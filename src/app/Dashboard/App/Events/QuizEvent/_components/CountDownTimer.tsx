interface Props {
  timer: number
}

function CountDownTimer({ timer }: Props) {
  return (
    <div className=' h-full grid place-items-center'>
      <div className=' font-bold  text-center'>
        <p>Get Ready For your question</p>
        <p className=' text-[6rem]'>{timer}</p>
        <small>Answer faster to gain more points</small>
      </div>
    </div>
  )
}

export default CountDownTimer

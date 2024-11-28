interface Props {
  index: number
  name: string
  score: number
}

export default function LeaderboardItem({ index, score, name }: Props) {
  return (
    <div
      style={{ animationDelay: `${index * 0.2}s` }}
      className=' h-12 bg-black/80 text-sm flex justify-between items-center slide-in-bottom'>
      <span className=' w-[8%] flex items-center justify-center bg-white h-full clip-start relative -top-1'>
        {index}
      </span>
      <p className='flex-auto text-left text-white pl-5'>{name}</p>
      <span className=' w-[12%] flex items-center justify-center bg-primary/70 h-full clip-end relative -top-1'>
        <span className=' w-[97%] flex items-center justify-center bg-white h-full clip-end absolute right-0'>
          {score}
        </span>
      </span>
    </div>
  )
}

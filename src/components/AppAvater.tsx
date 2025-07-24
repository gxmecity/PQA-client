import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface Props {
  img_url?: string
  fallbackText: string
  classname?: string
}

export default function AppAvater({ img_url, fallbackText, classname }: Props) {
  const fallback = fallbackText.split(' ')
  return (
    <Avatar className={classname}>
      <AvatarImage src={img_url} />
      <AvatarFallback className=' bg-game text-xs'>
        {fallback.slice(0, 3).map((word) => word.slice(0, 1))}
      </AvatarFallback>
    </Avatar>
  )
}

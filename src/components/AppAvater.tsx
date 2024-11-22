import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface Props {
  img_url: string
  fallbackText: string
}

export default function AppAvater({ img_url, fallbackText }: Props) {
  const fallback = fallbackText.split(' ')
  return (
    <Avatar>
      <AvatarImage src={img_url} />
      <AvatarFallback className=' bg-primary text-xs'>
        {fallback.slice(0, 3).map((word) => word.slice(0, 1))}
      </AvatarFallback>
    </Avatar>
  )
}

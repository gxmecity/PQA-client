import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

interface Props {
  title: string
  description?: string
  variant?: 'default' | 'destructive' | null | undefined
}

export default function ErrorMessage({ variant, title, description }: Props) {
  return (
    <Alert variant={variant}>
      {variant === 'destructive' && <AlertCircle className='h-5 w-5' />}
      <AlertTitle className=' font-semibold'>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  )
}

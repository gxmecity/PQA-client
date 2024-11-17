import { ReactNode } from 'react'
import { Button } from './ui/button'

interface Props {
  text?: string
  classname?: string
  icon?: ReactNode
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
    | undefined
  loading?: boolean
  disabled?: boolean
  type?: HTMLButtonElement['type']
  onClick?: () => void
}

const AppButton = ({
  text,
  classname,
  icon,
  variant,
  loading,
  disabled,
  type = 'button',
  onClick,
}: Props) => {
  return (
    <Button
      variant={variant}
      className={classname}
      type={type}
      onClick={onClick}
      disabled={loading || disabled}>
      {icon && <span>{icon}</span>}
      {text && <span>{loading ? 'Loading...' : text}</span>}
    </Button>
  )
}

export default AppButton

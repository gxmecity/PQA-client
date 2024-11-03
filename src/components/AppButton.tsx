import { ReactNode } from 'react'
import { Button, buttonVariants } from './ui/button'

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
}

const AppButton = ({
  text,
  classname,
  icon,
  variant,
  loading,
  disabled,
  type = 'button',
}: Props) => {
  return (
    <Button
      variant={variant}
      className={classname}
      type={type}
      disabled={loading || disabled}>
      {text && <span>{loading ? 'Loading...' : text}</span>}
      {icon && <span>icon</span>}
    </Button>
  )
}

export default AppButton

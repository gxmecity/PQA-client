import { ReactNode } from 'react'

interface Props {
  icon?: ReactNode
  title: string
  description?: string
  children?: ReactNode
}

const EmptyState = ({ title, description, icon, children }: Props) => {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-5'>
      <span>{icon}</span>
      <div className='text-center'>
        <h3 className='font-semibold'>{title}</h3>
        <small className='text-muted-foreground'>{description}</small>
      </div>
      {children}
    </div>
  )
}

export default EmptyState

import React, { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

interface Props {
  title: string
  value: string
  description: string
  icon: ReactNode
}

const DashboardTile = ({ title, description, value, icon }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className=' flex items-center justify-between'>
          <CardTitle>{title}</CardTitle>
          <span className='text-primary/80 '>{icon}</span>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className='text-2xl font-bold'>{value}</h3>
        <CardDescription className='text-xs'>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

export default DashboardTile

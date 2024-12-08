import React, { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Skeleton } from './ui/skeleton'

interface Props {
  title: string
  value: string
  description: string
  icon: ReactNode
  loading?: boolean
}

const DashboardTile = ({ title, description, value, icon, loading }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className=' flex items-center justify-between'>
          <CardTitle>{title}</CardTitle>
          <span className='text-primary/80 '>{icon}</span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className=' h-8 w-8' />
            <Skeleton className=' h-5 w-[60%] mt-1' />
          </>
        ) : (
          <>
            <h3 className='text-2xl font-bold'>{value}</h3>
            <CardDescription className='text-xs'>{description}</CardDescription>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default DashboardTile

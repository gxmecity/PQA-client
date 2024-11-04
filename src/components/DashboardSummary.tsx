import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

interface Props {
  title: string
  children: ReactNode
  url: string
}

const DashboardSummary = ({ title, children, url }: Props) => {
  return (
    <Card className=' flex flex-col'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className='flex-auto'>{children}</CardContent>
      <CardFooter className=' flex items-center justify-center'>
        <Link to={url} className=' text-primary font-medium text-sm'>
          See More
        </Link>
      </CardFooter>
    </Card>
  )
}

export default DashboardSummary

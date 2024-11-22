import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import React, { ReactNode } from 'react'

interface Props {
  open: boolean
  setOpen: (arg: boolean) => void
  title: string
  description?: string
  children?: ReactNode
}

export default function AppDialog({
  open,
  setOpen,
  title,
  children,
  description,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=' rounded-lg w-[80%] max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { toast } from 'sonner'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const errorResponseHandler = (err: ErrorResponse) => {
  if (!err?.data.message) {
    toast.error('Uh oh! Something went wrong.', {
      description: 'There was a problem with your request.',
    })
    return
  }

  const errorMessage = err.data.message

  if (typeof errorMessage === 'string') {
    return toast.error('Uh oh! Something went wrong.', {
      description: errorMessage,
    })
  }

  const message: { [key in string]: string[] } = errorMessage

  for (const key in message) {
    const errormessage = `${key} : ${message[key].join(' ')}`
    toast.error('Uh oh! Something went wrong.', {
      description: errormessage,
    })
  }
}

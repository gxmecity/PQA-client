/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Textarea } from './ui/textarea'

interface FormTextAreaComponent {
  name: string
  form: any
  label?: string
  placeholder?: string
  description?: string
}

const FormTextArea = ({
  name,
  form,
  label,
  description,
  placeholder,
}: FormTextAreaComponent) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div
              className={clsx(
                ' flex items-center rounded-md w-full gap-1 border border-border px-2'
              )}>
              <Textarea
                placeholder={placeholder}
                {...field}
                rows={5}
                className=' focus-visible:ring-0 border-none rounded-none bg-transparent px-0 placeholder:text-sm placeholder:text-muted-foreground placeholder:font-light resize-none'
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage className=' form-error-message' />
        </FormItem>
      )}
    />
  )
}

export default FormTextArea

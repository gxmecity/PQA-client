/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx'
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormField,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { HTMLInputTypeAttribute, useState } from 'react'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { ReactNode } from 'react'

interface FormInputComponent {
  name: string
  form: any
  label?: string
  type: HTMLInputTypeAttribute
  placeholder?: string
  icon?: ReactNode
  description?: string
  classname?: string
}

const FormInput = ({
  name,
  form,
  label,
  type,
  icon,
  description,
  placeholder,
  classname,
}: FormInputComponent) => {
  const [fieldType, setFieldType] = useState<HTMLInputTypeAttribute>(type)

  const showPassword = () => {
    if (type === 'password')
      setFieldType(fieldType === 'password' ? 'text' : 'password')
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex-auto'>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div
              className={clsx(
                ' flex items-center rounded-md w-full h-12 gap-1 border border-border px-2',
                classname
              )}>
              {icon && <>{icon}</>}
              <Input
                placeholder={placeholder}
                {...field}
                type={fieldType}
                inputMode={fieldType === 'number' ? 'tel' : undefined}
                className=' focus-visible:ring-0 border-none rounded-none bg-transparent h-full px-0 placeholder:text-sm placeholder:text-muted-foreground placeholder:font-light'
              />
              {type === 'password' && (
                <button onClick={showPassword} type='button'>
                  {fieldType === 'password' ? (
                    <EyeClosedIcon />
                  ) : (
                    <EyeOpenIcon />
                  )}
                </button>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage className=' form-error-message' />
        </FormItem>
      )}
    />
  )
}

export default FormInput

import clsx from 'clsx'
import { Checkbox } from './ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from './ui/form'

interface FormChecboxComponent {
  name: string
  form: any
  label: string
  description?: string
  classname?: string
}

const FormCheckbox = ({
  form,
  name,
  label,
  description,
  classname,
}: FormChecboxComponent) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={clsx(
            'flex flex-row items-center space-x-3 space-y-0 p-4 shadow cursor-pointer',
            classname
          )}>
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className='space-y-1 leading-none'>
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
        </FormItem>
      )}
    />
  )
}

export default FormCheckbox

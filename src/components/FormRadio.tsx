import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SelectOptionType } from './AppSelect'

interface Props {
  options: SelectOptionType[]
  form: any
  name: string
  label?: string
  groupStyles?: string
  optionStyles?: string
}

const FormRadio = ({
  form,
  name,
  label,
  options,
  optionStyles,
  groupStyles,
}: Props) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-3'>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className='flex gap-3 py-4 space-y-1 items-center'>
              {options.map((option) => (
                <FormItem key={option.value} className='cursor-pointer'>
                  <span className='flex items-center space-x-3 space-y-0 cursor-pointer'>
                    <FormControl>
                      <RadioGroupItem value={option.value} />
                    </FormControl>
                    <FormLabel className='font-normal cursor-pointer'>
                      {option.name}
                    </FormLabel>
                  </span>
                  {option.description && (
                    <FormDescription>{option.description}</FormDescription>
                  )}
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormRadio

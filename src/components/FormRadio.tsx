import {
  FormControl,
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
              className='flex gap-5 py-4 space-y-1'>
              {options.map((option) => (
                <FormItem
                  className='flex items-center space-x-3 space-y-0 cursor-pointer'
                  key={option.value}>
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className='font-normal cursor-pointer'>
                    {option.name}
                  </FormLabel>
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

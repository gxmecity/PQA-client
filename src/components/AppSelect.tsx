import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface SelectOptionType {
  name: string
  value: string
  description?: string
}

interface Props {
  placeholder?: string
  options: SelectOptionType[]
  handleChange: (value: string) => void
  label?: string
  classname?: string
  defaultValue?: string
}

export function AppSelect({
  handleChange,
  placeholder,
  options,
  label,
  classname,
  defaultValue,
}: Props) {
  return (
    <div className={classname}>
      <Select defaultValue={defaultValue} onValueChange={handleChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder={placeholder || 'Select an option'} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {label && <SelectLabel>{label}</SelectLabel>}

            {options.map((option) => (
              <SelectItem value={option.value} key={option.value}>
                {option.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

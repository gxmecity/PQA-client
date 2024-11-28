import { Check, ChevronsUpDown } from 'lucide-react'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface ComboboxOption {
  value: string
  label: string
  icon?: string
}

interface Props {
  selected: ComboboxOption | null
  setSelected: (arg: ComboboxOption | null) => void
  options: ComboboxOption[]
  placeholder?: string
  text?: string
  classname?: string
  loading?: boolean
}

export function AppComboBox({
  options,
  selected,
  setSelected,
  text,
  placeholder = 'Search for option',
  classname,
  loading,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          disabled={loading}
          aria-expanded={open}
          className={cn('w-full justify-between', classname)}>
          {loading ? (
            <>Loading...</>
          ) : (
            <>
              {' '}
              {selected ? (
                <>
                  {selected.icon && <img src={selected.icon} alt='' />}
                  {selected.label}
                </>
              ) : (
                <>{text || 'Select an option'}</>
              )}
            </>
          )}

          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className=' p-0'>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={(value) => {
                    setSelected(
                      options.find((priority) => priority.value === value) ||
                        null
                    )
                    setOpen(false)
                  }}>
                  {status.icon && (
                    <img
                      src={status.icon}
                      className={cn(
                        'mr-2 h-4 w-4',
                        status.value === selected?.value
                          ? 'opacity-100'
                          : 'opacity-40'
                      )}
                    />
                  )}

                  <span>{status.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

import type { GridProps } from '@mui/material'
import type { FieldValues, Path, RegisterOptions } from 'react-hook-form'

export interface FormInputProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>
  label: string
  rules?: Omit<RegisterOptions<TFieldValues>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
  gridProps?: GridProps
}

export interface SelectOption {
  label: string
  value: string
}

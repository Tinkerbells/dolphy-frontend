import type { TextFieldProps as MuiTextFieldProps } from '@mui/material'

import { TextField as MuiTextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

export type TextFieldProps = Omit<MuiTextFieldProps, 'name'> & {
  name: string
}

export function TextField({ name, ...props }: TextFieldProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MuiTextField
          {...field}
          {...props}
          error={!!error}
          helperText={error?.message || props.helperText}
        />
      )}
    />
  )
}

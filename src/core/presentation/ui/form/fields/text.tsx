import type { FieldValues } from 'react-hook-form'
import type { TextFieldProps } from '@mui/material'

import { Controller } from 'react-hook-form'
import { Grid, TextField } from '@mui/material'

import type { FormInputProps } from './index'

import { useFormContext } from '../form-builder'

export interface FormInputTextProps {
  textFieldProps?: TextFieldProps
}

type Props<TFieldValues extends FieldValues = FieldValues> = FormInputProps<TFieldValues> & FormInputTextProps

export function FormInputText<TFieldValues extends FieldValues = FieldValues>({
  name,
  rules,
  label,
  textFieldProps,
  gridProps = { size: 12 },
}: Props<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  return (
    <Grid {...gridProps}>
      <Controller<TFieldValues>
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value = '', onBlur }, fieldState: { error } }) => (
          <TextField
            {...textFieldProps}
            helperText={error ? error.message : (textFieldProps?.helperText || undefined)}
            error={!!error}
            onChange={onChange}
            value={value}
            fullWidth
            label={label}
            onBlur={(e) => {
              textFieldProps?.onBlur?.(e)
              onBlur()
            }}
          />
        )}
      />
    </Grid>
  )
}

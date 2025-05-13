import type { FieldValues } from 'react-hook-form'
import type { TextFieldProps } from '@mui/material'

import { useMemo } from 'react'
import { Controller } from 'react-hook-form'
import { Grid, MenuItem, TextField } from '@mui/material'

import type { FormInputProps, SelectOption } from './common'

import { useFormContext } from '../../providers'

export interface FormInputSelectProps {
  options: SelectOption[]
  inputProps?: TextFieldProps
  native?: boolean
}

type Props<TFieldValues extends FieldValues = FieldValues> = FormInputProps<TFieldValues> & FormInputSelectProps

export function FormInputSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  rules,
  options,
  inputProps,
  native = false,
  gridProps,
}: Props<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  // Мемоизируем опции для предотвращения ненужных перерисовок
  const renderedOptions = useMemo(() => {
    if (native) {
      return options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))
    }
    else {
      return options.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))
    }
  }, [options, native])

  return (
    <Grid {...gridProps}>
      <Controller<TFieldValues>
        rules={rules}
        name={name}
        control={control}
        render={({ field: { onChange, value = '', onBlur }, fieldState: { error } }) => (
          <TextField
            {...inputProps}
            select
            fullWidth
            onChange={onChange}
            value={value}
            label={label}
            error={!!error}
            helperText={error ? error.message || ' ' : inputProps?.helperText || ' '}
            onBlur={(e) => {
              inputProps?.onBlur?.(e)
              onBlur()
            }}
          >
            {renderedOptions}
          </TextField>
        )}
      />
    </Grid>
  )
}

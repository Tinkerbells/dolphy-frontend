import * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from '@mui/material'

export interface SelectOption {
  value: string | number
  label: string
}

export interface SelectFieldProps {
  name: string
  label?: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  fullWidth?: boolean
  error?: string
  disabled?: boolean
}

export function SelectField({
  name,
  label,
  options,
  placeholder,
  required,
  fullWidth = true,
  disabled,
}: SelectFieldProps) {
  const { control } = useFormContext()
  const labelId = `${name}-label`

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth={fullWidth} error={!!error} required={required} disabled={disabled}>
          {label && <InputLabel id={labelId}>{label}</InputLabel>}

          <MuiSelect
            {...field}
            labelId={labelId}
            label={label}
            displayEmpty={!!placeholder}
          >
            {placeholder && (
              <MenuItem value="" disabled>
                {placeholder}
              </MenuItem>
            )}

            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </MuiSelect>

          {error?.message && (
            <FormHelperText>{error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}

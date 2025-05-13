import type { FieldValues } from 'react-hook-form'
import type { FormControlProps, CheckboxProps as MuiCheckboxProps } from '@mui/material'

import { Controller } from 'react-hook-form'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
} from '@mui/material'

import type { FormInputProps } from './index'

import { useFormContext } from '../form-builder'

export interface FormInputCheckboxProps {
  formControlProps?: FormControlProps
  checkboxProps?: MuiCheckboxProps
  helperText?: string
}

type Props<TFieldValues extends FieldValues = FieldValues> = FormInputProps<TFieldValues> & FormInputCheckboxProps

export function FormInputCheckbox<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  rules,
  formControlProps,
  checkboxProps,
  helperText,
  gridProps = { size: 12 },
}: Props<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <Grid {...gridProps}>
      <Controller<TFieldValues>
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value = false }, fieldState: { error } }) => (
          <FormControl {...formControlProps} error={!!error}>
            <FormGroup>
              <FormControlLabel
                control={(
                  <Checkbox
                    {...checkboxProps}
                    checked={value as boolean}
                    onChange={onChange}
                  />
                )}
                label={label}
              />
              <FormHelperText>{error ? error.message || ' ' : helperText || ' '}</FormHelperText>
            </FormGroup>
          </FormControl>
        )}
      />
    </Grid>
  )
}

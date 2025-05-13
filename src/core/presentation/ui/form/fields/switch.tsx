import type { FieldValues } from 'react-hook-form'
import type {
  FormControlLabelProps,
  FormGroupProps,
  SwitchProps,
} from '@mui/material'

import { Controller } from 'react-hook-form'
import {
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Switch,
} from '@mui/material'

import type { FormInputProps } from './index'

import { useFormContext } from '../form-builder'

export interface FormInputSwitchProps {
  switchProps?: SwitchProps
  formGroupProps?: FormGroupProps
  formControlLabelProps?: FormControlLabelProps
  helperText?: string
}

type Props<TFieldValues extends FieldValues = FieldValues> = FormInputProps<TFieldValues> & FormInputSwitchProps

export function FormInputSwitch<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  rules,
  switchProps,
  formGroupProps,
  formControlLabelProps,
  helperText,
  gridProps = { size: 12 },
}: Props<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <Grid {...gridProps}>
      <Controller<TFieldValues>
        rules={rules}
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormGroup {...formGroupProps}>
            <FormControlLabel
              {...formControlLabelProps}
              control={(
                <Switch
                  {...switchProps}
                  checked={value as boolean}
                  onChange={onChange}
                />
              )}
              label={label}
            />
            <FormHelperText>{error ? error.message || ' ' : helperText || ' '}</FormHelperText>
          </FormGroup>
        )}
      />
    </Grid>
  )
}

import type { FieldValues } from 'react-hook-form'
import type {
  RadioGroupProps,
  RadioProps,
} from '@mui/material'

import { Controller } from 'react-hook-form'
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@mui/material'

import type { FormInputProps, SelectOption } from './common'

import { useFormContext } from '../../providers'

export interface FormInputRadioProps {
  options: (SelectOption & {
    radioProps?: RadioProps
  })[]
  radioGroupProps?: RadioGroupProps
  globalRadioProps?: RadioProps
  helperText?: string
}

type Props<TFieldValues extends FieldValues = FieldValues> = FormInputProps<TFieldValues> & FormInputRadioProps

export function FormInputRadio<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  rules,
  options,
  radioGroupProps,
  globalRadioProps,
  helperText,
  gridProps,
}: Props<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <Grid {...gridProps}>
      <Controller<TFieldValues>
        name={name}
        rules={rules}
        control={control}
        render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
          <FormControl component="fieldset" error={!!error}>
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup {...radioGroupProps} value={value} onChange={onChange}>
              {options.map(option => (
                <FormControlLabel
                  key={option.label}
                  value={option.value}
                  label={option.label}
                  control={<Radio {...globalRadioProps} {...option.radioProps} />}
                />
              ))}
            </RadioGroup>
            <FormHelperText>{error ? error.message || ' ' : helperText || ' '}</FormHelperText>
          </FormControl>
        )}
      />
    </Grid>
  )
}

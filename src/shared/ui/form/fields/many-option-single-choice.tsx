import type { FieldValues } from 'react-hook-form'
import type {
  CheckboxProps,
  GridProps,
  TypographyProps,
} from '@mui/material'

import { Controller } from 'react-hook-form'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material'

import type { FormInputProps } from './index'

import { useFormContext } from '../form-builder'

export interface FormInputManyOptionSingleChoiceProps {
  options: {
    label: string
    value?: string
    gridProps?: GridProps
    checkboxProps?: CheckboxProps
  }[]
  globalCheckboxProps?: CheckboxProps
  globalGridProps?: GridProps
  helperText?: string
  titleProps?: TypographyProps
  subtitleProps?: TypographyProps
}

type Props<TFieldValues extends FieldValues = FieldValues> = FormInputProps<TFieldValues> & FormInputManyOptionSingleChoiceProps

export function FormInputManyOptionSingleChoice<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  rules,
  options,
  gridProps = { size: 12 },
  globalGridProps,
  globalCheckboxProps,
  helperText,
  subtitleProps = { variant: 'caption', sx: { color: ({ palette }) => palette.text.secondary } },
  titleProps = { variant: 'h6' },
}: Props<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <Grid {...gridProps} container sx={{ paddingBottom: 2 }}>
      <Grid>
        <Typography {...titleProps}>{label}</Typography>
        <Typography {...subtitleProps}>{helperText}</Typography>
      </Grid>
      <Controller<TFieldValues>
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value: valueFromFormControl, onChange } }) => (
          <>
            {options.map(({ label, value: checkboxValue, gridProps, checkboxProps }) => {
              const thisCheckboxValue = checkboxValue || label
              return (
                <Grid {...(gridProps || globalGridProps)} container key={label + checkboxValue}>
                  <FormControl>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          {...(checkboxProps || globalCheckboxProps)}
                          disabled={!!valueFromFormControl && thisCheckboxValue !== valueFromFormControl}
                          checked={thisCheckboxValue === valueFromFormControl}
                          onChange={({ target: { checked } }) => onChange(checked ? thisCheckboxValue : null)}
                        />
                      )}
                      label={label}
                    />
                  </FormControl>
                </Grid>
              )
            })}
          </>
        )}
      />
    </Grid>
  )
}

import type { FieldValues } from 'react-hook-form'
import type {
  CheckboxProps,
  GridProps,
  TypographyProps,
} from '@mui/material'

import { Controller, useWatch } from 'react-hook-form'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material'

import type { FormInputProps } from './index'

import { useFormContext } from '../form-builder'

export interface FormInputMultiCheckboxProps {
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

type Props<TFieldValues extends FieldValues = FieldValues> = FormInputProps<TFieldValues> & FormInputMultiCheckboxProps

export function FormInputMultiCheckbox<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  options,
  gridProps = { size: 12 },
  globalCheckboxProps,
  globalGridProps,
  rules,
  helperText,
  subtitleProps = { variant: 'caption', sx: { color: ({ palette }) => palette.text.secondary } },
  titleProps = { variant: 'h6' },
}: Props<TFieldValues>) {
  const { control, setValue, getValues } = useFormContext<TFieldValues>()

  const selectedItems = getValues(name) as string[] || []
  useWatch({ control, name })

  const handleSelect = (value: string) => {
    const isPresent = selectedItems.indexOf(value)
    if (isPresent !== -1) {
      // Удаляем значение из выбранных
      const remaining = selectedItems.filter(item => item !== value)
      setValue(name, remaining as any, { shouldValidate: true })
    }
    else {
      // Добавляем значение к выбранным
      const newValues = [...selectedItems, value]
      setValue(name, newValues as any, { shouldValidate: true })
    }
  }

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
        render={() => (
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
                          checked={selectedItems.includes(thisCheckboxValue)}
                          onChange={() => handleSelect(thisCheckboxValue)}
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

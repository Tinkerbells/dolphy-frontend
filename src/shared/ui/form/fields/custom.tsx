import type { GridProps } from '@mui/material'
import type { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from 'react-hook-form'

import { Grid } from '@mui/material'
import { Controller } from 'react-hook-form'

import { useFormContext } from '../form-builder'

export interface CustomRenderArgs<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<TFieldValues>
}

export interface FormInputCustomProps<TFieldValues extends FieldValues = FieldValues> {
  children: (options: CustomRenderArgs<TFieldValues>) => JSX.Element
  name: Path<TFieldValues>
  rules?: any
  gridProps?: GridProps
}

export function FormInputCustom<TFieldValues extends FieldValues = FieldValues>({
  name,
  children,
  rules,
  gridProps = { size: 12 },
}: FormInputCustomProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <Grid {...gridProps}>
      <Controller<TFieldValues>
        rules={rules}
        name={name}
        control={control}
        render={children}
      />
    </Grid>
  )
}

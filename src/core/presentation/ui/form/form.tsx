import type { GridProps } from '@mui/material'
import type { FieldValues } from 'react-hook-form'

import { Grid } from '@mui/material'

import type { Config } from './components/form-input'

import { FormInput } from './components/form-input'

export interface FormProps<TFieldValues extends FieldValues = FieldValues> {
  gridSpacing?: GridProps['spacing']
  inputs: Config<TFieldValues>[]
}

export function Form<TFieldValues extends FieldValues = FieldValues>({
  inputs,
  gridSpacing = 1,
}: FormProps<TFieldValues>) {
  return (
    <Grid container spacing={gridSpacing}>
      {inputs.map(input => (
        <FormInput key={input.config.control.name} {...input} />
      ))}
    </Grid>
  )
}

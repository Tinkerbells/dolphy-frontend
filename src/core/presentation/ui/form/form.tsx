import type { GridProps } from '@mui/material'
import type { FieldValues } from 'react-hook-form'

import { Grid } from '@mui/material'

import type { Config } from './components'

import { FormInput } from './components'

export function Form<TFieldValues extends FieldValues = FieldValues>({ inputs, gridSpacing = 1 }: Props<TFieldValues>) {
  return (
    <Grid container spacing={gridSpacing}>
      {inputs.map(input => (
        <FormInput key={input.config.control.name} {...input} />
      ))}
    </Grid>
  )
}

export interface Props<TFieldValues extends FieldValues = FieldValues> {
  gridSpacing?: GridProps['spacing']
  inputs: Config<TFieldValues>[]
}

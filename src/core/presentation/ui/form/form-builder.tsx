import type { GridProps } from '@mui/material'
import type { MobxForm } from 'mobx-react-hook-form'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { Grid } from '@mui/material'
import { createContext, useContext } from 'react'

import type { FormConfig } from './fields'

import { FormField } from './fields'

interface Props<TFieldValues extends FieldValues = FieldValues> {
  form: MobxForm<TFieldValues>
  fields: FormConfig<TFieldValues>[]
  gridSpacing?: GridProps['spacing']
}

type FormProviderContext<TFieldValues extends FieldValues = FieldValues> = MobxForm<TFieldValues>

export const FormContext = createContext<FormProviderContext<any>>({} as FormProviderContext<any>)

export function FormBuilder<TFieldValues extends FieldValues = FieldValues>({ form, fields, gridSpacing }: Props<TFieldValues>) {
  return (
    <FormContext.Provider value={form}>
      <Grid container spacing={gridSpacing}>
        {fields.map(field => (
          <FormField key={field.config.control.name} {...field} />
        ))}
      </Grid>
    </FormContext.Provider>
  )
}

export function useFormContext<TFieldValues extends FieldValues = FieldValues>(): MobxForm<TFieldValues> {
  const context = useContext(FormContext)

  if (!context) {
    throw new Error('useFormContext должен использоваться внутри FormBuilder')
  }

  return context
}

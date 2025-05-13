import type { ComponentType } from 'react'
import type { FieldValues } from 'react-hook-form'
import type { MobxForm } from 'mobx-react-hook-form'

import { FormProvider } from '../providers'

export function withForm<P extends object, TFieldValues extends FieldValues = FieldValues>(Component: ComponentType<P>, form: MobxForm<TFieldValues>) {
  return (componentProps: P) => {
    return (
      <FormProvider form={form}>
        <Component {...componentProps} />
      </FormProvider>
    )
  }
}

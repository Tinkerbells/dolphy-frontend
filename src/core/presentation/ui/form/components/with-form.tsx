import type { FC } from 'react'
import type { FieldValues } from 'react-hook-form'
import type { MobxForm } from 'mobx-react-hook-form'

import { FormProvider } from '../providers'

export function withForm<TFieldValues extends FieldValues = FieldValues>(form: MobxForm<TFieldValues>, Component: FC<TFieldValues>) {
  return (componentProps: TFieldValues) => {
    return (
      <FormProvider form={form}>
        <Component {...componentProps} />
      </FormProvider>
    )
  }
}

import type { MobxForm } from 'mobx-react-hook-form'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { createContext, useContext } from 'react'
import { useMobxForm } from 'mobx-react-hook-form'

interface Props<TFieldValues extends FieldValues = FieldValues> {
  children: JSX.Element
  form: MobxForm<TFieldValues>
}

type FormProviderContext<TFieldValues extends FieldValues = FieldValues> = UseFormReturn<TFieldValues>

export const FormContext = createContext<FormProviderContext<any>>({} as FormProviderContext<any>)

export function FormProvider<TFieldValues extends FieldValues = FieldValues>({ children, form }: Props<TFieldValues>) {
  const useFormResult = useMobxForm<MobxForm<TFieldValues>>(form)

  return <FormContext.Provider value={useFormResult}>{children}</FormContext.Provider>
}

export function useFormContext<TFieldValues extends FieldValues = FieldValues>(): UseFormReturn<TFieldValues> {
  const context = useContext(FormContext)

  if (!context) {
    throw new Error('useFormContext должен использоваться внутри FormProvider')
  }

  return context as UseFormReturn<TFieldValues>
}

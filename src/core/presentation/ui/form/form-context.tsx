import type { FieldValues } from 'react-hook-form'
import type { MobxForm } from 'mobx-react-hook-form'

import * as React from 'react'
import { useMobxForm } from 'mobx-react-hook-form'
import { FormProvider, useFormContext, useWatch } from 'react-hook-form'

interface FormContextValue {
  formId: string
  saveDrafts: boolean
}

const FormContext = React.createContext<FormContextValue | null>(null)

export function useFormSettings() {
  const context = React.useContext(FormContext)
  if (!context) {
    throw new Error('useFormSettings must be used within a FormProvider')
  }
  return context
}

interface FormContainerProps<TFieldValues extends FieldValues = FieldValues> {
  children: React.ReactNode
  methods: MobxForm<TFieldValues> // Или UseFormReturn из react-hook-form
  formId?: string
  saveDrafts?: boolean
  onSubmit?: (data: TFieldValues) => void
  className?: string
  title?: string
  description?: string
}

export function Form<TFieldValues extends FieldValues = FieldValues>({
  children,
  methods,
  formId = 'default-form',
  saveDrafts = false,
  onSubmit,
  className,
  title,
  description,
}: FormContainerProps<TFieldValues>) {
  // Используем mobx-react-hook-form или напрямую useForm
  const form = useMobxForm(methods)

  // Эффект для загрузки черновика
  React.useEffect(() => {
    if (saveDrafts) {
      const draftKey = `form_draft_${formId}`
      const savedDraft = localStorage.getItem(draftKey)

      if (savedDraft) {
        try {
          const draftValues = JSON.parse(savedDraft)
          form.reset(draftValues)
          // Уведомление о загрузке черновика
        }
        catch (e) {
          console.error('Ошибка загрузки черновика:', e)
        }
      }
    }
  }, [form, formId, saveDrafts])

  const handleSaveDraft = React.useCallback(() => {
    if (saveDrafts) {
      const currentValues = form.getValues()
      localStorage.setItem(`form_draft_${formId}`, JSON.stringify(currentValues))
      // Уведомление о сохранении
    }
  }, [form, formId, saveDrafts])

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (onSubmit) {
        form.handleSubmit(onSubmit)(e)
      }
    },
    [form, onSubmit],
  )

  return (
    <FormContext.Provider value={{ formId, saveDrafts }}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className={className} noValidate>
          {title && <h2 className="form-title">{title}</h2>}
          {description && <p className="form-description">{description}</p>}
          {children}
          {saveDrafts && (
            <div className="form-actions">
              <button type="button" onClick={handleSaveDraft} className="save-draft-button">
                Сохранить черновик
              </button>
            </div>
          )}
        </form>
      </FormProvider>
    </FormContext.Provider>
  )
}

export function useFormValues<TFieldValues extends FieldValues = FieldValues>() {
  const { control } = useFormContext<TFieldValues>()
  return useWatch({ control }) as TFieldValues
}

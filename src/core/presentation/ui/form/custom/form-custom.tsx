import type { Control, ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from 'react-hook-form'

import { Controller } from 'react-hook-form'

import { FormFieldWrapper } from '../form-field-wrapper'

/**
 * Интерфейс для функции рендеринга пользовательского компонента
 */
export interface FormCustomComponentProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
  /**
   * Функция рендеринга пользовательского компонента
   * Принимает объект с полем, состоянием поля и состоянием формы
   */
  render: ({ field, fieldState, formState }: {
    field: ControllerRenderProps<TFieldValues, TName>
    fieldState: ControllerFieldState
    formState: UseFormStateReturn<TFieldValues>
  }) => React.ReactElement
  /** Текст метки */
  label?: string
  /** Обязательное поле */
  required?: boolean
}

/**
 * Компонент для создания пользовательских полей формы
 * Позволяет создавать кастомные поля ввода с полным контролем над их отображением
 */
export function FormCustomComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  name,
  control,
  label,
  required,
  render,
}: {
  name: TName
  control: Control<TFieldValues>
  label?: string
  required?: boolean
  render: FormCustomComponentProps<TFieldValues, TName>['render']
}) {
  return (
    <Controller<TFieldValues, TName>
      name={name}
      control={control}
      render={({ field, fieldState, formState }) => (
        <FormFieldWrapper label={label} error={fieldState.error?.message} required={required}>
          {render({ field, fieldState, formState })}
        </FormFieldWrapper>
      )}
    />
  )
}

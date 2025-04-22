import type { Control, ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from 'react-hook-form'

import { Controller } from 'react-hook-form'

import { FormFieldWrapper } from '../form-field-wrapper'

export interface FormCustomComponentProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
  render: ({ field, fieldState, formState }: {
    field: ControllerRenderProps<TFieldValues, TName>
    fieldState: ControllerFieldState
    formState: UseFormStateReturn<TFieldValues>
  }) => React.ReactElement
  label?: string
}

export function FormCustomComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  name,
  control,
  label,
  render,
}: {
  name: TName
  control: Control<TFieldValues>
  label?: string
  render: FormCustomComponentProps<TFieldValues, TName>['render']
}) {
  return (
    <Controller<TFieldValues, TName>
      name={name}
      control={control}
      render={({ field, fieldState, formState }) => (
        <FormFieldWrapper label={label} error={fieldState.error?.message}>
          {render({ field, fieldState, formState })}
        </FormFieldWrapper>
      )}
    />
  )
}

import type { TextAreaProps } from '@tinkerbells/xenon-ui'
import type { FieldValues, UseControllerProps } from 'react-hook-form'

import { Controller } from 'react-hook-form'
import { Input } from '@tinkerbells/xenon-ui'

import { FormFieldWrapper } from '../form-field-wrapper'

export interface FormTextAreaProps extends Omit<TextAreaProps, 'name'> {
  label?: string
}

export function FormTextArea<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  ...props
}: FormTextAreaProps & Omit<UseControllerProps<TFieldValues>, 'defaultValue'>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref: _, ...controllerProps }, fieldState: { error } }) => (
        <FormFieldWrapper label={label} error={error?.message}>
          <Input.TextArea
            status={error ? 'error' : undefined}
            {...controllerProps}
            {...props}
          />
        </FormFieldWrapper>
      )}
    />
  )
}

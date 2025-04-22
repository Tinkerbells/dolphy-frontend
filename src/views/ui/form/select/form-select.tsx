import type { SelectProps } from '@tinkerbells/xenon-ui'
import type { FieldValues, UseControllerProps } from 'react-hook-form'

import { Controller } from 'react-hook-form'
import { Select } from '@tinkerbells/xenon-ui'

import { FormFieldWrapper } from '../form-field-wrapper'

export interface FormSelectProps extends Omit<SelectProps, 'name'> {
  label?: string
}

export function FormSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  ...props
}: FormSelectProps & Omit<UseControllerProps<TFieldValues>, 'defaultValue'>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref: _, ...controllerProps }, fieldState: { error } }) => (
        <FormFieldWrapper label={label} error={error?.message}>
          <Select
            style={{ width: '100%' }}
            status={error ? 'error' : undefined}
            {...controllerProps}
            {...props}
          />
        </FormFieldWrapper>
      )}
    />
  )
}

import type { DatePickerProps } from '@tinkerbells/xenon-ui'
import type { FieldValues, UseControllerProps } from 'react-hook-form'

import { Controller } from 'react-hook-form'
import { DatePicker } from '@tinkerbells/xenon-ui'

import { FormFieldWrapper } from '../form-field-wrapper'

export interface FormDatePickerProps extends Omit<DatePickerProps, 'name'> {
  label?: string
}

export function FormDatePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  ...props
}: FormDatePickerProps & Omit<UseControllerProps<TFieldValues>, 'defaultValue'>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref: _, ...controllerProps }, fieldState: { error } }) => (
        <FormFieldWrapper label={label} error={error?.message}>
          <DatePicker
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

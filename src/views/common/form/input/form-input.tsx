import type { TextFieldProps } from '@mui/material'
import type { FieldValues, UseControllerProps } from 'react-hook-form'

import { TextField } from '@mui/material'
import { Controller } from 'react-hook-form'

import { FormFieldWrapper } from '../form-field-wrapper'

/**
 * Интерфейс свойств компонента FormInput
 */
export type FormInputProps = Omit<TextFieldProps, 'name'>

/**
 * Компонент текстового поля формы
 * Использует Material UI TextField с react-hook-form Controller
 */
export function FormInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  ...props
}: FormInputProps & Omit<UseControllerProps<TFieldValues>, 'defaultValue'>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <FormFieldWrapper error={error?.message}>
          <TextField
            {...field}
            inputRef={ref}
            fullWidth
            error={!!error}
            variant="outlined"
            size="medium"
            {...props}
          />
        </FormFieldWrapper>
      )}
    />
  )
}

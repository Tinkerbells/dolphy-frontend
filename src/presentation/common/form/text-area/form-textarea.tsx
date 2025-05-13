import type { TextFieldProps } from '@mui/material'
import type { FieldValues, UseControllerProps } from 'react-hook-form'

import { TextField } from '@mui/material'
import { Controller } from 'react-hook-form'

import { FormFieldWrapper } from '../form-field-wrapper'

/**
 * Интерфейс свойств компонента FormTextArea
 */
export interface FormTextAreaProps extends Omit<TextFieldProps, 'name' | 'multiline'> {
  /** Текст метки */
  label?: string
  /** Обязательное поле */
  required?: boolean
  /** Минимальное количество строк */
  minRows?: number
  /** Максимальное количество строк */
  maxRows?: number
}

/**
 * Компонент многострочного текстового поля формы
 * Использует Material UI TextField с multiline=true и react-hook-form Controller
 */
export function FormTextArea<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  required,
  minRows = 3,
  maxRows = 10,
  ...props
}: FormTextAreaProps & Omit<UseControllerProps<TFieldValues>, 'defaultValue'>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <FormFieldWrapper label={label} error={error?.message} required={required}>
          <TextField
            {...field}
            inputRef={ref}
            fullWidth
            error={!!error}
            variant="outlined"
            multiline
            minRows={minRows}
            maxRows={maxRows}
            size="medium"
            {...props}
          />
        </FormFieldWrapper>
      )}
    />
  )
}

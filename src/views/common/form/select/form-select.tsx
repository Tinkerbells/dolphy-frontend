import type { FormControlProps, SelectProps } from '@mui/material'
import type { FieldValues, UseControllerProps } from 'react-hook-form'

import { Controller } from 'react-hook-form'
import { FormControl, MenuItem, Select } from '@mui/material'

import { FormFieldWrapper } from '../form-field-wrapper'

/**
 * Интерфейс для опции выпадающего списка
 */
export interface SelectOption {
  /** Значение опции */
  value: string | number
  /** Отображаемый текст опции */
  label: string
  /** Дополнительные данные опции */
  [key: string]: any
}

/**
 * Интерфейс свойств компонента FormSelect
 */
export interface FormSelectProps extends Omit<SelectProps, 'name'> {
  /** Текст метки */
  label?: string
  /** Обязательное поле */
  required?: boolean
  /** Опции выпадающего списка */
  options: SelectOption[]
  /** Свойства контейнера FormControl */
  formControlProps?: FormControlProps
  /** Текст для пустого значения */
  placeholder?: string
}

/**
 * Компонент выпадающего списка формы
 * Использует Material UI Select с react-hook-form Controller
 */
export function FormSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  required,
  options,
  formControlProps,
  placeholder,
  ...props
}: FormSelectProps & Omit<UseControllerProps<TFieldValues>, 'defaultValue'>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormFieldWrapper label={label} error={error?.message} required={required}>
          <FormControl
            fullWidth
            error={!!error}
            variant="outlined"
            size="medium"
            {...formControlProps}
          >
            <Select
              {...field}
              displayEmpty={!!placeholder}
              {...props}
            >
              {placeholder && (
                <MenuItem value="" disabled>
                  {placeholder}
                </MenuItem>
              )}

              {options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormFieldWrapper>
      )}
    />
  )
}

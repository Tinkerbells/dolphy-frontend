import type { Color, ColorPickerProps } from '@tinkerbells/xenon-ui'
import type { FieldValues, UseControllerProps } from 'react-hook-form'

import { Controller } from 'react-hook-form'
import { ColorPicker } from '@tinkerbells/xenon-ui'

import { FormFieldWrapper } from '../form-field-wrapper'

export interface FormColorPickerProps extends Omit<ColorPickerProps, 'name'> {
  label?: string
}

export function FormColorPicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  ...props
}: FormColorPickerProps & Omit<UseControllerProps<TFieldValues>, 'defaultValue'>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref: _, onChange, ...controllerProps }, fieldState: { error } }) => (
        <FormFieldWrapper label={label} error={error?.message}>
          <ColorPicker
            {...controllerProps}
            {...props}
            onChange={(color: Color) => {
              onChange(color.toHexString ? color.toHexString() : color)
            }}
          />
        </FormFieldWrapper>
      )}
    />
  )
}

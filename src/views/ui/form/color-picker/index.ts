import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import type { FormColorPickerProps } from './form-color-picker'

import { FormField } from '../form-field'
import { FormColorPicker } from './form-color-picker'

export class ColorPickerField<TFieldValues extends FieldValues = FieldValues> extends FormField<TFieldValues> {
  private props: FormColorPickerProps

  constructor(name: Path<TFieldValues>, props: FormColorPickerProps, label?: string) {
    super(name, label)
    this.props = props
  }

  render(control: Control<TFieldValues>): ReactNode {
    return FormColorPicker({
      control,
      name: this.name,
      label: this.label,
      ...this.props,
    })
  }
}

export type { FormColorPickerProps } from './form-color-picker'

import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import type { FormDatePickerProps } from './form-date-picker'

import { FormField } from '../form-field'
import { FormDatePicker } from './form-date-picker'

export class DatePickerField<TFieldValues extends FieldValues = FieldValues> extends FormField<TFieldValues> {
  private props: FormDatePickerProps

  constructor(name: Path<TFieldValues>, props: FormDatePickerProps, label?: string) {
    super(name, label)
    this.props = props
  }

  render(control: Control<TFieldValues>): ReactNode {
    return FormDatePicker({
      control,
      name: this.name,
      label: this.label,
      ...this.props,
    })
  }
}

export type { FormDatePickerProps } from './form-date-picker'

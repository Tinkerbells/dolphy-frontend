import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import type { FormSelectProps } from './form-select'

import { FormField } from '../form-field'
import { FormSelect } from './form-select'

export class SelectField<TFieldValues extends FieldValues = FieldValues> extends FormField<TFieldValues> {
  private props: FormSelectProps

  constructor(name: Path<TFieldValues>, props: FormSelectProps, label?: string) {
    super(name, label)
    this.props = props
  }

  render(control: Control<TFieldValues>): ReactNode {
    return FormSelect({
      control,
      name: this.name,
      label: this.label,
      ...this.props,
    })
  }
}

export type { FormSelectProps } from './form-select'

import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import type { FormInputProps } from './form-input'

import { FormInput } from './form-input'
import { FormField } from '../form-field'

export class InputField<TFieldValues extends FieldValues = FieldValues> extends FormField<TFieldValues> {
  private props: FormInputProps

  constructor(name: Path<TFieldValues>, props: FormInputProps, label?: string) {
    super(name, label)
    this.props = props
  }

  render(control: Control<TFieldValues>): ReactNode {
    return FormInput({
      control,
      name: this.name,
      label: this.label,
      ...this.props,
    })
  }
}

export type { FormInputProps } from './form-input'

import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import type { FormTextAreaProps } from './form-textarea'

import { FormField } from '../form-field'
import { FormTextArea } from './form-textarea'

export class TextAreaField<TFieldValues extends FieldValues = FieldValues> extends FormField<TFieldValues> {
  private props: FormTextAreaProps

  constructor(name: Path<TFieldValues>, props: FormTextAreaProps, label?: string) {
    super(name, label)
    this.props = props
  }

  render(control: Control<TFieldValues>): ReactNode {
    return FormTextArea({
      control,
      name: this.name,
      label: this.label,
      ...this.props,
    })
  }
}

export type { FormTextAreaProps } from './form-textarea'

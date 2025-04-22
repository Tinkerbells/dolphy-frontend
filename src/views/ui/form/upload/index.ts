import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import type { FormUploadProps } from './form-upload'

import { FormField } from '../form-field'
import { FormUpload } from './form-upload'

export class UploadField<TFieldValues extends FieldValues = FieldValues> extends FormField<TFieldValues> {
  private props: FormUploadProps

  constructor(name: Path<TFieldValues>, props: FormUploadProps, label?: string) {
    super(name, label)
    this.props = props
  }

  render(control: Control<TFieldValues>): ReactNode {
    return FormUpload({
      control,
      name: this.name,
      label: this.label,
      ...this.props,
    })
  }
}

export type { FormUploadProps } from './form-upload'

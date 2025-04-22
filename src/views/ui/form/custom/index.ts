import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import type { FormCustomComponentProps } from './form-custom'

import { FormField } from '../form-field'
import { FormCustomComponent } from './form-custom'

export class CustomField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends FormField<TFieldValues> {
  private props: FormCustomComponentProps<TFieldValues, TName>

  constructor(name: TName, props: FormCustomComponentProps<TFieldValues, TName>, label?: string) {
    super(name, label)
    this.props = props
  }

  render(control: Control<TFieldValues>): ReactNode {
    return FormCustomComponent<TFieldValues, TName>({
      control,
      name: this.name as TName,
      label: this.label,
      render: this.props.render,
    })
  }
}

export type { FormCustomComponentProps } from './form-custom'

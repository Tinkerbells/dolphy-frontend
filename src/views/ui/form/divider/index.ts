import type { ReactNode } from 'react'
import type { FieldValues } from 'react-hook-form'

import type { FormDividerProps } from './form-divider'

import { FormDivider } from './form-divider'
import { BaseFormField } from '../form-field'

export class DividerField<TFieldValues extends FieldValues> extends BaseFormField<TFieldValues> {
  private props?: FormDividerProps

  constructor(props?: FormDividerProps) {
    super()
    this.props = props
  }

  render(): ReactNode {
    return FormDivider({
      ...this.props,
    })
  }
}

export type { FormDividerProps } from './form-divider'

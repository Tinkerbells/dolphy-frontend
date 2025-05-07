import type { ReactNode } from 'react'
import type { FieldValues } from 'react-hook-form'

import type { FormDividerProps } from './form-divider'

import { FormDivider } from './form-divider'
import { BaseFormField } from '../form-field'

/**
 * Класс для создания разделителей в форме
 */
export class DividerField<TFieldValues extends FieldValues> extends BaseFormField<TFieldValues> {
  private props?: FormDividerProps

  /**
   * Создает экземпляр разделителя
   *
   * @param props - Свойства разделителя (опционально)
   */
  constructor(props?: FormDividerProps) {
    super()
    this.props = props
  }

  /**
   * Отрисовывает разделитель
   *
   * @returns Отрисованный разделитель
   */
  render(): ReactNode {
    return FormDivider({
      ...this.props,
    })
  }
}

export type { FormDividerProps } from './form-divider'

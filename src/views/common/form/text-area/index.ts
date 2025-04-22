import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import type { FormTextAreaProps } from './form-textarea'

import { FormField } from '../form-field'
import { FormTextArea } from './form-textarea'

/**
 * Класс для создания многострочных текстовых полей формы
 */
export class TextAreaField<TFieldValues extends FieldValues = FieldValues> extends FormField<TFieldValues> {
  private props: FormTextAreaProps

  /**
   * Создает экземпляр многострочного текстового поля
   *
   * @param name - Имя поля в форме
   * @param props - Свойства поля
   * @param label - Метка поля (опционально)
   */
  constructor(name: Path<TFieldValues>, props: FormTextAreaProps, label?: string) {
    super(name, label)
    this.props = props
  }

  /**
   * Отрисовывает многострочное текстовое поле
   *
   * @param control - Объект управления формой
   * @returns Отрисованное многострочное текстовое поле
   */
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

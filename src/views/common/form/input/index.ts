import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import type { FormInputProps } from './form-input'

import { FormInput } from './form-input'
import { FormField } from '../form-field'

/**
 * Класс для создания текстовых полей формы
 */
export class InputField<TFieldValues extends FieldValues = FieldValues> extends FormField<TFieldValues> {
  private props: FormInputProps

  /**
   * Создает экземпляр текстового поля
   *
   * @param name - Имя поля в форме
   * @param props - Свойства поля
   * @param label - Метка поля (опционально)
   */
  constructor(name: Path<TFieldValues>, props: FormInputProps, label?: string) {
    super(name, label)
    this.props = props
  }

  /**
   * Отрисовывает текстовое поле
   *
   * @param control - Объект управления формой
   * @returns Отрисованное текстовое поле
   */
  render(control: Control<TFieldValues>): ReactNode {
    return FormInput({
      control,
      name: this.name,
      ...this.props,
    })
  }
}

export type { FormInputProps } from './form-input'

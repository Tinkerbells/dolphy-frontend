import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import type { FormSelectProps } from './form-select'

import { FormField } from '../form-field'
import { FormSelect } from './form-select'

/**
 * Класс для создания выпадающих списков формы
 */
export class SelectField<TFieldValues extends FieldValues = FieldValues> extends FormField<TFieldValues> {
  private props: FormSelectProps

  /**
   * Создает экземпляр выпадающего списка
   *
   * @param name - Имя поля в форме
   * @param props - Свойства поля
   * @param label - Метка поля (опционально)
   */
  constructor(name: Path<TFieldValues>, props: FormSelectProps, label?: string) {
    super(name, label)
    this.props = props
  }

  /**
   * Отрисовывает выпадающий список
   *
   * @param control - Объект управления формой
   * @returns Отрисованный выпадающий список
   */
  render(control: Control<TFieldValues>): ReactNode {
    return FormSelect({
      control,
      name: this.name,
      label: this.label,
      ...this.props,
    })
  }
}

export type { FormSelectProps, SelectOption } from './form-select'

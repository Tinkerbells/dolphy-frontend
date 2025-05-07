import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import type { FormCustomComponentProps } from './form-custom'

import { FormField } from '../form-field'
import { FormCustomComponent } from './form-custom'

/**
 * Класс для создания пользовательских полей формы
 */
export class CustomField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends FormField<TFieldValues> {
  private props: FormCustomComponentProps<TFieldValues, TName>
  private required?: boolean

  /**
   * Создает экземпляр пользовательского поля
   *
   * @param name - Имя поля в форме
   * @param props - Свойства поля
   * @param label - Метка поля (опционально)
   * @param required - Обязательное поле (опционально)
   */
  constructor(
    name: TName,
    props: FormCustomComponentProps<TFieldValues, TName>,
    label?: string,
    required?: boolean,
  ) {
    super(name, label)
    this.props = props
    this.required = required
  }

  /**
   * Отрисовывает пользовательское поле
   *
   * @param control - Объект управления формой
   * @returns Отрисованное пользовательское поле
   */
  render(control: Control<TFieldValues>): ReactNode {
    return FormCustomComponent<TFieldValues, TName>({
      control,
      name: this.name as TName,
      label: this.label,
      required: this.required,
      render: this.props.render,
    })
  }
}

export type { FormCustomComponentProps } from './form-custom'

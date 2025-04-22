import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

/**
 * Базовый абстрактный класс для всех полей формы
 */
export abstract class BaseFormField<TFieldValues extends FieldValues = FieldValues> {
  abstract render(control: Control<TFieldValues>): ReactNode
}

/**
 * Абстрактный класс для полей формы с именем
 */
export abstract class FormField<
  TFieldValues extends FieldValues = FieldValues,
> extends BaseFormField<TFieldValues> {
  name: Path<TFieldValues>

  constructor(name: Path<TFieldValues>) {
    super()
    this.name = name
  }
}

/**
 * Интерфейс для свойств контроллера
 */
export interface ControllerProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>
  control: Control<TFieldValues>
}

/**
 * Перечисление типов компонентов формы
 */
export enum COMPONENT_TYPE {
  INPUT = 'input',
  PASSWORD = 'password',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  DATEPICKER = 'datepicker',
  DIVIDER = 'divider',
  SWITCH = 'switch',
  CHECKBOX = 'checkbox',
  COLORPICKER = 'colorpicker',
  UPLOAD = 'upload',
  CUSTOM = 'custom',
}

/**
 * Интерфейс для свойств поля формы
 */
export interface Property<FormValues extends FieldValues = FieldValues> {
  type: COMPONENT_TYPE
  name?: Path<FormValues>
  props: any
}

/**
 * Тип для массива свойств полей формы
 */
export type Properties<FormValues extends FieldValues = FieldValues> = Property<FormValues>[]

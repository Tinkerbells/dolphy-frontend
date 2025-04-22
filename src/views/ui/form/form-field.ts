import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

export abstract class BaseFormField<TFieldValues extends FieldValues = FieldValues> {
  abstract render(control: Control<TFieldValues>): ReactNode
}

export abstract class FormField<
  TFieldValues extends FieldValues = FieldValues,
> extends BaseFormField<TFieldValues> {
  name: Path<TFieldValues>
  label?: string

  constructor(name: Path<TFieldValues>, label?: string) {
    super()
    this.name = name
    this.label = label
  }
}

export interface ControllerProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>
  control: Control<TFieldValues>
}

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

export interface Property<FormValues extends FieldValues = FieldValues> {
  type: COMPONENT_TYPE
  name?: Path<FormValues>
  label?: string
  // TODO добавить пропсы компонетнов
  props: any
}

export type Properties<FormValues extends FieldValues = FieldValues> = Property<FormValues>[]

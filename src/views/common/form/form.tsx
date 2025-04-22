import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import * as React from 'react'
import { Box, Button, Stack } from '@mui/material'

import type { FormInputProps } from './input'
import type { FormSelectProps } from './select'
import type { BaseFormField } from './form-field'
import type { FormDividerProps } from './divider'
import type { FormTextAreaProps } from './text-area'
import type { FormCustomComponentProps } from './custom'

import { InputField } from './input'
import { SelectField } from './select'
import { CustomField } from './custom'
import { DividerField } from './divider'
import { TextAreaField } from './text-area'

type FormDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'

/**
 * Интерфейс опций формы
 */
interface FormOptions<TFieldValues extends FieldValues> {
  /** Текст кнопки отправки */
  submitText?: string
  /** Текст кнопки сброса */
  resetText?: string
  /** Отступы для сетки формы */
  spacing?: number
  /** Направление формы */
  direction?: FormDirection
  /** Обработчик отправки формы */
  onSubmit?: (data: TFieldValues) => void
  /** Обработчик сброса формы */
  onReset?: () => void
}

/**
 * Класс для построения форм с использованием Material UI
 */
export class Form<TFieldValues extends FieldValues = FieldValues> {
  /** Методы формы из react-hook-form */
  private methods: UseFormReturn<TFieldValues> | null = null
  /** Массив полей формы */
  private fields: BaseFormField<TFieldValues>[] = []
  /** Текст кнопки отправки */
  private submitText?: string
  /** Текст кнопки сброса */
  private resetText?: string
  /** Отступы для сетки формы */
  private spacing: number = 2
  private direction: FormDirection = 'column'
  /** Обработчик отправки формы */
  private onSubmit?: (data: TFieldValues) => void
  /** Обработчик сброса формы */
  private onReset?: () => void

  /**
   * Создает экземпляр формы
   *
   * @param methods - Методы формы из react-hook-form
   * @param options - Опции формы
   */
  constructor(
    methods: UseFormReturn<TFieldValues>,
    options?: FormOptions<TFieldValues>,
  ) {
    this.methods = methods
    if (options) {
      this.onSubmit = options.onSubmit
      this.onReset = options.onReset
      this.submitText = options.submitText
      this.resetText = options.resetText
      this.spacing = options.spacing || 2
      this.direction = options.direction || 'column'
    }
  }

  /**
   * Добавляет текстовое поле в форму
   *
   * @param name - Имя поля
   * @param props - Свойства поля
   * @returns Экземпляр формы для цепочки вызовов
   */
  input(name: Path<TFieldValues>, props: FormInputProps): Form<TFieldValues> {
    this.fields.push(new InputField(name, props))
    return this
  }

  /**
   * Добавляет многострочное текстовое поле в форму
   *
   * @param name - Имя поля
   * @param props - Свойства поля
   * @param label - Метка поля (опционально)
   * @returns Экземпляр формы для цепочки вызовов
   */
  textarea(name: Path<TFieldValues>, props: FormTextAreaProps, label?: string): Form<TFieldValues> {
    this.fields.push(new TextAreaField(name, props, label || props.label))
    return this
  }

  /**
   * Добавляет выпадающий список в форму
   *
   * @param name - Имя поля
   * @param props - Свойства поля
   * @param label - Метка поля (опционально)
   * @returns Экземпляр формы для цепочки вызовов
   */
  select(name: Path<TFieldValues>, props: FormSelectProps, label?: string): Form<TFieldValues> {
    this.fields.push(new SelectField(name, props, label || props.label))
    return this
  }

  /**
   * Добавляет разделитель в форму
   *
   * @param props - Свойства разделителя (опционально)
   * @returns Экземпляр формы для цепочки вызовов
   */
  divider(props?: FormDividerProps): Form<TFieldValues> {
    this.fields.push(new DividerField(props))
    return this
  }

  /**
   * Добавляет пользовательское поле в форму
   *
   * @param name - Имя поля
   * @param props - Свойства поля
   * @param label - Метка поля (опционально)
   * @returns Экземпляр формы для цепочки вызовов
   */
  custom<TName extends Path<TFieldValues>>(
    name: TName,
    props: FormCustomComponentProps<TFieldValues, TName>,
    label?: string,
  ): Form<TFieldValues> {
    this.fields.push(new CustomField<TFieldValues, TName>(name, props, label || props.label))
    return this
  }

  /**
   * Получает методы формы
   *
   * @returns Методы формы
   * @private
   */
  private getMethods() {
    return this.methods!
  }

  /**
   * Создает компонент формы
   *
   * @returns Компонент React формы
   */
  build() {
    const fields = this.fields
    const submitText = this.submitText
    const resetText = this.resetText
    const spacing = this.spacing
    const direction = this.direction
    const onSubmitCallback = this.onSubmit
    const onResetCallback = this.onReset

    const FormComponent = React.memo(
      React.forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>((props, ref) => {
        const { className, onSubmit: onSubmitProp, ...rest } = props

        const handleReset = React.useCallback(() => {
          if (onResetCallback) {
            onResetCallback()
          }
        }, [onResetCallback])

        const { handleSubmit, control, formState: { isSubmitting, isValid, isDirty } } = this.getMethods()

        const onSubmit = React.useCallback(
          (e?: React.BaseSyntheticEvent) => {
            handleSubmit?.((data) => {
              if (onSubmitCallback) {
                onSubmitCallback(data)
              }
              if (onSubmitProp && e) {
                onSubmitProp(e as React.FormEvent<HTMLFormElement>)
              }
            })(e)
          },
          [handleSubmit, onSubmitCallback, onSubmitProp],
        )

        const renderedFields = React.useMemo(() =>
          fields.map((field, index) => (
            <div key={`form-field-${index}`}>
              {field.render(control)}
            </div>
          )), [control, fields])

        const formControls = React.useMemo(() => {
          if (!submitText && !resetText)
            return null

          return (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              {resetText && (
                <Button
                  variant="outlined"
                  color="secondary"
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                >
                  {resetText}
                </Button>
              )}
              {submitText && (
                <Button
                  sx={{
                    minWidth: '100%',
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Загрузка...' : submitText}
                </Button>
              )}
            </Box>
          )
        }, [isSubmitting, isValid, isDirty, handleReset])

        return (
          <form
            ref={ref}
            onSubmit={onSubmit}
            className={className}
            noValidate
            {...rest}
          >
            <Stack direction={direction} spacing={spacing}>
              {renderedFields}
            </Stack>
            {formControls}
          </form>
        )
      }),
    )

    FormComponent.displayName = 'Form'

    return FormComponent
  }
}

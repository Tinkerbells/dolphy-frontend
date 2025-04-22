// todo добаить тип к name как в кастом к остальным
import './form.styles.scss'

import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import * as React from 'react'
import { Button, Col, Flex, Row } from '@tinkerbells/xenon-ui'

import { cn, Loader } from '@/shared'

import type { FormInputProps } from './input'
import type { FormUploadProps } from './upload'
import type { FormSelectProps } from './select'
import type { BaseFormField } from './form-field'
import type { FormDividerProps } from './divider'
import type { FormTextAreaProps } from './text-area'
import type { FormCustomComponentProps } from './custom'
import type { FormDatePickerProps } from './date-picker'
import type { FormColorPickerProps } from './color-picker'

import { InputField } from './input'
import { UploadField } from './upload'
import { SelectField } from './select'
import { CustomField } from './custom'
import { DividerField } from './divider'
import { TextAreaField } from './text-area'
import { DatePickerField } from './date-picker'
import { ColorPickerField } from './color-picker'

const b = cn('form')

export class Form<TFieldValues extends FieldValues = FieldValues> {
  private methods: UseFormReturn<TFieldValues> | null = null
  private fields: BaseFormField<TFieldValues>[] = []
  private submitText?: string
  private resetText?: string
  private gutter: [number, number] = [16, 24]
  private onSubmit?: (data: TFieldValues) => void
  private onReset?: () => void

  constructor(
    methods: UseFormReturn<TFieldValues>,
    options?: {
      submitText?: string
      resetText?: string
      gutter?: [number, number]
      onSubmit?: (data: TFieldValues) => void
      onReset?: () => void
    },
  ) {
    this.methods = methods
    if (options) {
      this.onSubmit = options.onSubmit
      this.onReset = options.onReset
      this.submitText = options.submitText
      this.resetText = options.resetText
      this.gutter = options.gutter || [16, 24]
    }
  }

  input(name: Path<TFieldValues>, props: FormInputProps): Form<TFieldValues> {
    this.fields.push(new InputField(name, props))
    return this
  }

  textarea(name: Path<TFieldValues>, props: FormTextAreaProps): Form<TFieldValues> {
    this.fields.push(new TextAreaField(name, props))
    return this
  }

  upload(name: Path<TFieldValues>, props: FormUploadProps): Form<TFieldValues> {
    this.fields.push(new UploadField(name, props))
    return this
  }

  datepicker(name: Path<TFieldValues>, props: FormDatePickerProps): Form<TFieldValues> {
    this.fields.push(new DatePickerField(name, props))
    return this
  }

  colorpicker(name: Path<TFieldValues>, props: FormColorPickerProps): Form<TFieldValues> {
    this.fields.push(new ColorPickerField(name, props))
    return this
  }

  select(name: Path<TFieldValues>, props: FormSelectProps): Form<TFieldValues> {
    this.fields.push(new SelectField(name, props))
    return this
  }

  divider(props?: FormDividerProps): Form<TFieldValues> {
    this.fields.push(new DividerField(props))
    return this
  }

  custom<TName extends Path<TFieldValues>>(
    name: TName,
    props: FormCustomComponentProps<TFieldValues, TName>,
  ): Form<TFieldValues> {
    this.fields.push(new CustomField<TFieldValues, TName>(name, props))
    return this
  }

  private getMethods() {
    return this.methods!
  }

  build() {
    const fields = this.fields
    const submitText = this.submitText
    const resetText = this.resetText
    const gutter = this.gutter
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

        const { handleSubmit, control, formState: { isSubmitting, disabled } } = this.getMethods()

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
            <Col key={`form-field-${index}`} span={24}>
              {field.render(control)}
            </Col>
          )), [control, fields])

        const formControls = React.useMemo(() => {
          if (!submitText && !resetText)
            return null

          return (
            <Flex gap="small" justify="end" className="form__controls">
              {resetText && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleReset}
                >
                  {resetText}
                </Button>
              )}
              {submitText && (
                <Button
                  type="submit"
                  disabled={disabled || isSubmitting}
                >
                  {isSubmitting ? <Loader /> : submitText}
                </Button>
              )}
            </Flex>
          )
        }, [isSubmitting, handleReset])

        return (
          <form
            ref={ref}
            onSubmit={onSubmit}
            className={b(null, className)}
            {...rest}
          >
            <Row gutter={gutter}>
              {renderedFields}
            </Row>
            {formControls}
          </form>
        )
      }),
    )

    FormComponent.displayName = 'Form'

    return FormComponent
  }
}

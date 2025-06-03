import type { ForwardedRef } from 'react'
import type {
  DateOrTimeView,
} from '@mui/x-date-pickers'
import type {
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form'

import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Controller,
} from 'react-hook-form'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers'

import { getValueByKey } from './helper'

type ValueDateType = Date | null | undefined
interface DateTimePickerFieldProps {
  disabled?: boolean
  className?: string
  views?: readonly DateOrTimeView[]
  minDate?: Date
  maxDate?: Date
  autoFocus?: boolean
  readOnly?: boolean
  label: string
  testId?: string
  error?: string
  defaultValue?: ValueDateType
}
const DateTimePickerInput = forwardRef(DateTimePickerInputRaw) as never as (
  props: DateTimePickerFieldProps & {
    name: string
    value: ValueDateType
    onChange: (value: ValueDateType) => void
    onBlur: () => void
  } & { ref?: ForwardedRef<HTMLDivElement | null> }
) => ReturnType<typeof DateTimePickerInputRaw>

function DateTimePickerInputRaw(
  props: DateTimePickerFieldProps & {
    name: string
    value: ValueDateType
    onChange: (value: ValueDateType) => void
    onBlur: () => void
  },
  ref?: ForwardedRef<HTMLDivElement | null>,
) {
  const { i18n } = useTranslation()

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={getValueByKey(i18n.language)}
    >
      <DateTimePicker
        ref={ref}
        name={props.name}
        label={props.label}
        value={props.value}
        onClose={props.onBlur}
        disabled={props.disabled}
        autoFocus={props.autoFocus}
        defaultValue={props.defaultValue}
        slotProps={{
          textField: {
            helperText: props.error,
            error: !!props.error,
            InputProps: {
              readOnly: props.readOnly,
            },
          },
        }}
        onAccept={props.onChange}
        minDate={props.minDate}
        maxDate={props.maxDate}
        views={props.views}
        data-testid={props.testId}
      />
    </LocalizationProvider>
  )
}
function FormDateTimePickerInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: DateTimePickerFieldProps &
    Pick<ControllerProps<TFieldValues, TName>, 'name' | 'defaultValue'>,
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => {
        return (
          <DateTimePickerInput
            {...field}
            defaultValue={props.defaultValue}
            autoFocus={props.autoFocus}
            label={props.label}
            disabled={props.disabled}
            readOnly={props.readOnly}
            views={props.views}
            testId={props.testId}
            minDate={props.minDate}
            maxDate={props.maxDate}
            error={fieldState.error?.message}
          />
        )
      }}
    />
  )
}

export default FormDateTimePickerInput

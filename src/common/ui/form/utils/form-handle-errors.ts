import type { MobxForm } from 'mobx-react-hook-form'

import type { Notify } from '@/common'
import type { NetError } from '@/common/services/http-client/net-error'

/**
 * Опции обработчика ошибок формы
 */
export interface FormErrorHandlerOptions {
  /** Показывать общее уведомление для ошибок без соответствия полям формы */
  showGeneralErrors?: boolean
  /** Фокусироваться на первом поле с ошибкой */
  focusFirstError?: boolean
  /** Игнорируемые поля (не будут устанавливаться в форму) */
  ignoreFields?: string[]
}

export function handleFormErrors<T extends Record<string, any>>(
  form: MobxForm<T>,
  error: NetError,
  notify: Notify,
  options: FormErrorHandlerOptions = {},
): boolean {
  const {
    showGeneralErrors = true,
    focusFirstError = true,
    ignoreFields = [],
  } = options

  // Проверяем наличие ошибок валидации
  if (!error.validationErrors || Object.keys(error.validationErrors).length === 0) {
    if (showGeneralErrors && error.message) {
      notify.error(error.message)
    }
    return false
  }

  let hasSetErrors = false
  let firstField = true

  // Обрабатываем ошибки валидации
  Object.entries(error.validationErrors).forEach(([field, message]) => {
    // Пропускаем игнорируемые поля
    if (ignoreFields.includes(field)) {
      return
    }

    // Если поле есть в форме, устанавливаем ошибку
    if (field in form.values) {
      // Используем shouldFocus только для первого поля с ошибкой если опция включена
      const shouldFocus = focusFirstError && firstField

      form.setError(field as any, {
        message,
      }, { shouldFocus })

      hasSetErrors = true
      firstField = false
    }
    else if (showGeneralErrors) {
      // Если поле не найдено в форме, показываем как общую ошибку
      notify.error(`${field}: ${message}`)
    }
  })

  return hasSetErrors
}

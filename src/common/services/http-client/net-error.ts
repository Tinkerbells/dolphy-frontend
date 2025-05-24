import { ResponseCode } from '@/types/enums/http.enum'

export interface NetErrorInitializer {
  code: ResponseCode
  status: string
  detail?: any
  validationErrors?: Record<string, string> // Добавляем для хранения ошибок валидации
}

/**
 * Custom net error
 */
class NetError extends Error {
  code: ResponseCode
  status: string
  detail?: any
  validationErrors?: Record<string, string> // Новое поле для ошибок валидации

  constructor(options: NetErrorInitializer) {
    super(options.status)
    this.code = options.code
    this.status = options.status
    this.detail = options.detail
    this.validationErrors = options.validationErrors
  }

  get isAbort(): boolean {
    return this.code === ResponseCode.ABORT
  }

  get isFetchError(): boolean {
    return this.code === ResponseCode.FETCH_ERROR
  }

  asMessage(comment: string): string {
    return `${comment} (${this.code}: ${this._asStr(this.status)})${
      this.detail
        ? `\n${this._asStr(this.detail)}`
        : ''
    }`
  }

  private _asStr(value: any): string {
    return (typeof value === 'object'
      ? JSON.stringify(value.detail || value)
      : String(value)).slice(0, 100)
  }

  hasValidationErrorFor(field: string): boolean {
    return !!(this.validationErrors && this.validationErrors[field])
  }

  getValidationErrorFor(field: string): string | undefined {
    return this.validationErrors?.[field]
  }
}

export { NetError }

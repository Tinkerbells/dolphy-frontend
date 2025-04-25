import { ResponseCode } from './net-enums'

export interface NetErrorInitializer {
  code: ResponseCode
  status: string
  detail?: any
}

/**
 * Custom net error
 */
class NetError extends Error {
  code: ResponseCode
  status: string
  detail?: any

  constructor(options: NetErrorInitializer) {
    super(options.status)
    this.code = options.code
    this.status = options.status
    this.detail = options.detail
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
}

export { NetError }


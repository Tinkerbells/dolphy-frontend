import type {
  CustomRequest,
  CustomResponse,
  NetRequest,
  NetService,
} from './types'

import { env } from '../env'
import { NetError } from './net-error'
import { localStorage } from '../local-storage'
import { NetRequestHandler } from './net-request'
import { FetchMethod, ResponseCode } from './net-enums'

type RequestKey = string

abstract class Net implements NetService {
  isLoaded: boolean

  protected readonly ORIGIN = env.get('VITE_API_URL')
  private readonly ACCESS = 'access_token'
  private readonly REFRESH = 'refresh_token'

  private _authWhiteList = ['/', '/auth/', '/courses/']

  private _requestMap: Map<RequestKey, NetRequest<any>>

  constructor() {
    this.isLoaded = true
    this._requestMap = new Map()

    if (
      !this.isAuthorized()
      && !this._authWhiteList.includes(this.currentPath)
    ) {
      this.goToAuth()
    }
  }

  get currentPath(): string {
    return window.location.pathname
  }

  get currentOrigin(): string {
    return window.location.origin
  }

  /**
   * Send a request
   *
   * If the `force` parameter is *false*, then the promise
   * of an incomplete request is returning, if it is.
   *
   * If the parameter is *true*, then the current request breaks off
   * and a new one is sent.
   *
   * @param request Request parameters
   * @returns Promise with abort controller
   */
  protected _send<T>(request: CustomRequest): NetRequest<T> {
    const key = this._requestKey(request)
    const prev = this._requestMap.get(key)
    if (prev) {
      if (!request.force) {
        return prev
      }
      prev.abort()
    }

    const requestHandler: NetRequest<T> = new NetRequestHandler({
      request,
      controller: request.controller || new AbortController(),
      promise: this._sendRequest<T>(request),
      onFinish: () => {
        this._requestMap.delete(key)
      },
    })
    this._requestMap.set(key, requestHandler)
    return requestHandler
  }

  /**
   * Send request to server
   * @param request Request parameters and body
   * @returns Data if success and detail if fail + code & status
   */
  protected async _sendRequest<T>(request: CustomRequest): Promise<T> {
    let response: Response
    let responseBody: T
    try {
      response = await this._fetch(request)
      responseBody = await response.json()
      if (response.ok) {
        return responseBody
      }
    }
    catch (error) {
      this._handleSpecialError(error as Error)
      throw new NetError({
        code: ResponseCode.FETCH_ERROR,
        status: (error as Error).message,
      })
    }
    throw new NetError({
      code: response.status,
      status: (responseBody as any).error_code || response.statusText,
      detail: (responseBody as any).detail,
    })
  }

  private _requestKey(request: CustomRequest): RequestKey {
    return request.key || `${request.path}_${request.method}`
  }

  private _handleSpecialError(error: Error) {
    if ((error as Error).name !== 'AbortError') {
      throw new NetError({
        code: ResponseCode.ABORT,
        status: 'Запрос отклонен',
      })
    }
    if (!navigator.onLine) {
      throw new NetError({
        code: ResponseCode.FETCH_ERROR,
        status: 'Отсутствует подключение к Интернету',
      })
    }
  }

  /**
   * Make request object
   */
  protected _fetch({
    path,
    body,
    method = FetchMethod.get,
    withHeaders = true,
    controller,
  }: CustomRequest): Promise<Response> {
    if (!body || method === FetchMethod.get) {
      return withHeaders
        ? fetch(`${this.ORIGIN}/api/v1/${path}`, {
            headers: this._makeHeaders(),
            signal: controller?.signal,
          })
        : fetch(`${this.ORIGIN}/api/v1/${path}`, {
            signal: controller?.signal,
          })
    }
    return fetch(`${this.ORIGIN}/api/v1/${path}`, {
      method,
      headers: this._makeHeaders(),
      body: JSON.stringify(body),
      signal: controller?.signal,
    })
  }

  private _makeHeaders(): HeadersInit {
    const headers: HeadersInit = [
      ['Content-Type', 'application/json;charset=utf-8'],
      // ['X-CSRFToken', cookies.get('csrftoken') || ''],
      ['Authorization', `JWT ${localStorage.getAsString(this.ACCESS)}`],
    ]
    return headers
  }

  protected _goTo(path: string, replace?: boolean, locally?: boolean) {
    const origin = locally ? this.currentOrigin : this.ORIGIN
    const macroTaskTimer = setTimeout(() => {
      clearTimeout(macroTaskTimer)
      replace
        ? window.location.replace(origin + path)
        : window.location.assign(origin + path)
    })
  }

  /**
   * Change window location to auth page
   */
  goToAuth() {
    const path
      = env.isProduction()
        ? '/api/sso_auth/'
        : '/api/sso_auth/test/'
    this._goTo(path)
  }

  protected _isStatusOk(code: number): boolean {
    return code >= ResponseCode.OK && code < 300
  }

  protected _isResponseOk(res: CustomResponse<any>): boolean {
    return this._isStatusOk(res.code) && res.data !== undefined
  }

  abortRequests(keys: RequestKey[]) {
    keys.forEach((key) => {
      const request = this._requestMap.get(key)
      if (request && !request.isClosed) {
        request.abort()
      }
    })
  }

  isAuthorized(): boolean {
    return localStorage.has(this.ACCESS) && localStorage.has(this.REFRESH)
  }

  protected _warn(response: CustomResponse<any>, error?: string) {
    console.warn(
      `${response.status}\n${response.code}: ${response.detail}${error ? `\n${error}` : ''
      }`,
    )
  }
}

export { Net }

import type { AuthTokens, CustomRequest, CustomResponse } from './types'

import { env } from '../env'
import { NetError } from './net-error'
import { localStorage } from '../local-storage'
import { FetchMethod, ResponseCode } from './net-enums'

abstract class Net {
  protected readonly ORIGIN = env.get('VITE_API_URL')
  private readonly ACCESS = 'access_token'
  private readonly REFRESH = 'refresh_token'

  private _authWhiteList = ['/', '/auth/', '/courses/']

  constructor() {
    if (!this.isAuthorized() && !this._authWhiteList.includes(window.location.pathname)) {
      this.goToAuth()
    }
  }

  /**
   * Выполняет запрос к API
   */
  protected async _send<T>(request: CustomRequest): Promise<T> {
    try {
      // Не пытаемся повторно выполнить запрос refresh
      const isRefreshRequest = request.path === 'refresh'

      const response = await this._fetch(request)
      const responseBody = await response.json()

      if (response.ok) {
        return responseBody
      }

      // Если ошибка авторизации и это не запрос refresh, пробуем обновить токен
      if (response.status === ResponseCode.AUTH_ERROR && !isRefreshRequest) {
        const refreshSuccess = await this.refresh()
        if (refreshSuccess) {
          // Повторяем запрос с новым токеном
          return this._send<T>(request)
        }
      }

      throw new NetError({
        code: response.status,
        status: (responseBody as any).error_code || response.statusText,
        detail: (responseBody as any).detail,
      })
    }
    catch (error) {
      if (!navigator.onLine) {
        throw new NetError({
          code: ResponseCode.FETCH_ERROR,
          status: 'Отсутствует подключение к Интернету',
        })
      }

      throw new NetError({
        code: ResponseCode.FETCH_ERROR,
        status: (error as Error).message,
      })
    }
  }

  /**
   * Создает и выполняет fetch-запрос
   */
  protected _fetch({
    path,
    body,
    method = FetchMethod.get,
    withHeaders = true,
     withAuth = false,
  }: CustomRequest & { withAuth?: boolean }): Promise<Response> {
    const url = `${this.ORIGIN}/api/v1/${path}`

    if (!body || method === FetchMethod.get) {
      return withHeaders
        ? fetch(url, { headers: this._makeHeaders(withAuth) })
        : fetch(url)
    }

    return fetch(url, {
      method,
      headers: this._makeHeaders(withAuth),
      body: JSON.stringify(body),
    })
  }

  /**
   * Создает заголовки для запроса
   * @param skipAuth - Если true, то заголовок авторизации не добавляется
   */
  private _makeHeaders(skipAuth = false): HeadersInit {
    const headers: HeadersInit = [
      ['Content-Type', 'application/json;charset=utf-8'],
    ]

    // Добавляем заголовок авторизации только если не указано skipAuth
    if (!skipAuth) {
      headers.push(['Authorization', `Bearer ${localStorage.getAsString(this.ACCESS)}`])
    }

    return headers
  }

  /**
   * Обновляет токены доступа с помощью refresh токена
   *
   * @returns {Promise<boolean>} Результат обновления токенов (успех/неудача)
   */
  async refresh(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getAsString(this.REFRESH)

      if (!refreshToken) {
        console.error('Refresh token не найден')
        this.goToAuth()
        return false
      }

      // Используем _fetch с параметром skipAuth=true, чтобы избежать добавления
      // авторизационного заголовка с недействительным токеном
      const response = await this._fetch({
        path: 'refresh',
        method: 'POST',
        body: { refresh_token: refreshToken },
        withAuth: true, // Важно! Предотвращает бесконечную рекурсию
      })

      const responseBody = await response.json()

      if (!response.ok) {
        console.error('Не удалось обновить токены')
        this.goToAuth()
        return false
      }

      const tokens: AuthTokens = responseBody

      // Сохраняем новые токены
      localStorage.setPrimitive(this.ACCESS, tokens.access_token)
      localStorage.setPrimitive(this.REFRESH, tokens.refresh_token)

      return true
    }
    catch (error) {
      console.error('Ошибка при обновлении токенов:', error)
      this.goToAuth()
      return false
    }
  }

  /**
   * Перенаправляет на страницу авторизации
   */
  goToAuth() {
    const path = '/sign-in'
    window.location.assign(this.ORIGIN + path)
  }

  /**
   * Проверяет, авторизован ли пользователь
   */
  isAuthorized(): boolean {
    return localStorage.has(this.ACCESS) && localStorage.has(this.REFRESH)
  }

  /**
   * Проверяет, успешен ли код ответа
   */
  protected _isStatusOk(code: number): boolean {
    return code >= ResponseCode.OK && code < 300
  }

  /**
   * Проверяет, успешен ли ответ
   */
  protected _isResponseOk(res: CustomResponse<any>): boolean {
    return this._isStatusOk(res.code) && res.data !== undefined
  }
}

export { Net }

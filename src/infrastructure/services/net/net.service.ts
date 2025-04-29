import { jwtDecode } from 'jwt-decode'

import type { PersistPort } from '@/domain'

import { env } from '@/utils/env'

import type { AuthTokens, CustomRequest, CustomResponse } from './types'

import { NetError } from './net-error'
import { LocalStorageService } from '../local-storage'
import { FetchMethod, ResponseCode } from './net-enums'

abstract class NetService {
  protected readonly ORIGIN = env.get('VITE_API_URL')
  private readonly ACCESS = 'access_token'
  private readonly REFRESH = 'refresh_token'
  private persistService: PersistPort = new LocalStorageService()
  private _authWhiteList = ['/', '/decks/', '/courses/']

  constructor(
  ) {
    if (!this.isAuthorized() && !this._authWhiteList.includes(window.location.pathname)) {
      // this.goToAuth()
    }
  }

  /**
   * Выполняет запрос к API
   */
  protected async _send<T>(request: CustomRequest): Promise<T> {
    try {
      // Не пытаемся повторно выполнить запрос refresh
      const isRefreshRequest = request.path === 'auth/refresh'

      // Проверяем, истек ли токен и требуется ли обновление
      if (this._isTokenExpired() && this.isAuthorized()) {
        const refreshSuccess = await this._refreshToken()
        if (!refreshSuccess) {
          // Если обновление не удалось, перенаправляем на страницу авторизации
          this.goToAuth()
          throw new NetError({
            code: ResponseCode.AUTH_ERROR,
            status: 'Ошибка авторизации',
          })
        }
        // После успешного обновления токена продолжаем выполнение запроса
      }

      const response = await this._fetch(request)
      const responseBody = await response.json()

      if (response.ok) {
        return responseBody
      }

      if (response.status === ResponseCode.AUTH_ERROR && !isRefreshRequest) {
        const refreshSuccess = await this._refreshToken()
        if (refreshSuccess) {
          // Повторяем запрос с новым токеном
          return this._send<T>(request)
        }
      }

      throw new NetError({
        code: response.status,
        status: (responseBody as any).error_code || response.statusText,
        detail: (responseBody as any).detail,
        validationErrors: responseBody.errors,
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
        code: (error as NetError).code,
        status: (error as NetError).status,
        detail: (error as NetError).detail,
        validationErrors: (error as NetError).validationErrors,
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
    isRefresh = false,
  }: CustomRequest & { isRefresh?: boolean }): Promise<Response> {
    const url = `${this.ORIGIN}/api/v1/${path}`

    if (method === FetchMethod.get) {
      return withHeaders
        ? fetch(url, { headers: this._makeHeaders(isRefresh) })
        : fetch(url)
    }

    return fetch(url, {
      method,
      headers: this._makeHeaders(isRefresh),
      body: JSON.stringify(body),
    })
  }

  private _makeHeaders(isRefresh = false): HeadersInit {
    const headers: HeadersInit = [
      ['Content-Type', 'application/json;charset=utf-8'],
    ]

    headers.push(['Authorization', `Bearer ${this.persistService.getAsString(isRefresh ? this.REFRESH : this.ACCESS)}`])

    return headers
  }

  /**
   * Обновляет токены доступа с помощью refresh токена
   *
   * @returns {Promise<boolean>} Результат обновления токенов (успех/неудача)
   */
  private async _refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.persistService.getAsString(this.REFRESH)

      if (!refreshToken) {
        console.error('Refresh token не найден')
        this.goToAuth()
        return false
      }

      // Используем _fetch с параметром withAuth=true, чтобы избежать добавления
      // авторизационного заголовка с недействительным токеном
      const response = await this._fetch({
        path: 'auth/refresh',
        method: 'post',
        isRefresh: true, // Важно! Предотвращает бесконечную рекурсию
      })

      const responseBody = await response.json()

      if (!response.ok) {
        console.error('Не удалось обновить токены')
        this.goToAuth()
        return false
      }

      const tokens: AuthTokens = responseBody

      // Сохраняем новые токены
      this.persistService.setPrimitive(this.ACCESS, tokens.token)
      this.persistService.setPrimitive(this.REFRESH, tokens.refreshToken)

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
    window.location.assign(path)
  }

  /**
   * Проверяет, авторизован ли пользователь
   */
  isAuthorized(): boolean {
    return this.persistService.has(this.ACCESS) && this.persistService.has(this.REFRESH)
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

  protected _isTokenExpired() {
    const token = this.persistService.getAsString(this.ACCESS)
    try {
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000
      return decodedToken.exp! < currentTime
    }

    catch (error) {
      console.error('Error decoding token:', error)
      return true
    }
  }
}

export { NetService }

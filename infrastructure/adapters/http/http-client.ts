import { jwtDecode } from 'jwt-decode'
import { inject, injectable } from 'inversiland'

import type EnvPort from '@/core/domain/ports/env.port'
import type { HttpClientPort } from '@/core/domain/ports/http-client.port'
import type { PersistStoragePort } from '@/core/domain/ports/persist-storage.port'
import type { ViteEnvironmentVariables } from '@/core/infrastructure/adapters/env'

import { EnvPortToken } from '@/core/domain/ports/env.port'
import { PersistStoragePortToken } from '@/core/domain/ports/persist-storage.port'

import type { AuthTokens, CustomRequest, CustomResponse } from './types'

import { NetError } from './net-error'
import { FetchMethod, ResponseCode } from './net-enums'

@injectable()
export class HttpClient implements HttpClientPort {
  private readonly ACCESS_TOKEN = 'access_token'
  private readonly REFRESH_TOKEN = 'refresh_token'
  protected readonly ORIGIN = this.env.get('VITE_API_URL')
  private _authWhiteList = ['/', '/decks/', '/courses/']

  constructor(
    @inject(PersistStoragePortToken) protected readonly persistService: PersistStoragePort,
    @inject(EnvPortToken) protected readonly env: EnvPort<ViteEnvironmentVariables>,
  ) {
    if (!this.isAuthorized() && !this._authWhiteList.includes(window.location.pathname)) {
      this.goToAuth()
    }
  }

  public async get<T>(url: string, config?: RequestInit): Promise<T> {
    return this._send<T>({ path: url, method: FetchMethod.get, ...config })
  }

  public async post<D, T>(url: string, data?: D, config?: RequestInit): Promise<T> {
    return this._send<T>({ path: url, method: FetchMethod.post, body: data, ...config })
  }

  public async patch<D, T>(url: string, data?: D, config?: RequestInit): Promise<T> {
    return this._send<T>({ path: url, method: FetchMethod.patch, body: data, ...config })
  }

  public async delete<T>(url: string, config?: RequestInit): Promise<T> {
    return this._send<T>({ path: url, method: FetchMethod.delete, ...config })
  }

  protected async _send<T>(request: CustomRequest): Promise<T> {
    try {
      const isRefreshRequest = request.path.includes('auth/refresh')

      if (this._isTokenExpired() && this.isAuthorized()) {
        const refreshed = await this._refreshToken()
        if (!refreshed) {
          throw new NetError({ code: ResponseCode.AUTH_ERROR, status: 'Ошибка авторизации' })
        }
      }

      const response = await this._fetch(request)
      const body = await response.json()

      if (response.ok)
        return body

      if (response.status === ResponseCode.AUTH_ERROR && !isRefreshRequest) {
        const refreshed = await this._refreshToken()
        if (refreshed)
          return this._send<T>(request)
      }

      throw new NetError({
        code: response.status,
        status: body.error_code || response.statusText,
        detail: body.detail,
        validationErrors: body.errors,
      })
    }
    catch (error) {
      if (!navigator.onLine) {
        throw new NetError({ code: 0, status: 'Отсутствует подключение к Интернету' })
      }
      throw error
    }
  }

  protected _fetch({
    path,
    method = FetchMethod.get,
    body,
    withHeaders = true,
    isRefresh = false,
    ...config
  }: CustomRequest & { isRefresh?: boolean }): Promise<Response> {
    const url = `${this.ORIGIN}/api/v1/${path}`

    const headers = withHeaders ? this._makeHeaders(isRefresh) : undefined

    const requestConfig: RequestInit = {
      method,
      headers,
      ...config,
    }

    if (body && method !== FetchMethod.get) {
      requestConfig.body
        = typeof body === 'object' && !(body instanceof Blob || body instanceof FormData || body instanceof URLSearchParams)
          ? JSON.stringify(body)
          : (body as BodyInit)
    }

    return fetch(url, requestConfig)
  }

  private _makeHeaders(isRefresh = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json;charset=utf-8',
    }

    const token = this.persistService.getAsString(isRefresh ? this.REFRESH_TOKEN : this.ACCESS_TOKEN)
    if (token)
      headers.Authorization = `Bearer ${token}`

    return headers
  }

  private async _refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.persistService.getAsString(this.REFRESH_TOKEN)
      if (!refreshToken) {
        this.goToAuth()
        return false
      }

      const response = await this._fetch({
        path: 'auth/refresh',
        method: FetchMethod.post,
        isRefresh: true,
      })

      const data = await response.json()
      if (!response.ok) {
        this.goToAuth()
        return false
      }

      const tokens: AuthTokens = data
      this.persistService.setPrimitive(this.ACCESS_TOKEN, tokens.token)
      this.persistService.setPrimitive(this.REFRESH_TOKEN, tokens.refreshToken)

      return true
    }
    catch (error) {
      console.error('Ошибка при обновлении токенов:', error)
      this.goToAuth()
      return false
    }
  }

  protected _isTokenExpired(): boolean {
    const token = this.persistService.getAsString(this.ACCESS_TOKEN)
    try {
      const decoded = jwtDecode(token)
      const now = Date.now() / 1000
      return decoded.exp! < now
    }
    catch {
      return true
    }
  }

  protected _isStatusOk(code: number): boolean {
    return code >= 200 && code < 300
  }

  protected _isResponseOk<T>(res: CustomResponse<T>): boolean {
    return this._isStatusOk(res.code) && res.data !== undefined
  }

  protected isAuthorized(): boolean {
    return this.persistService.has(this.ACCESS_TOKEN) && this.persistService.has(this.REFRESH_TOKEN)
  }

  protected goToAuth(): void {
    window.location.assign('/sign-in')
  }
}

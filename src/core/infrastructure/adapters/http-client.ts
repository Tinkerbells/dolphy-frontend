import { jwtDecode } from 'jwt-decode'
import { inject, injectable } from 'inversiland'

import type { EnvPort } from '@/core/domain/ports/env.port'
import type { PersistStoragePort } from '@/core/domain/ports/persist-storage.port'
import type { HttpClientPort, HttpRequest } from '@/core/domain/ports/http-client.port'

import { EnvPortToken } from '@/core/domain/ports/env.port'
import { FetchMethod, ResponseCode } from '@/core/domain/enums/http.enum'
import { PersistStoragePortToken } from '@/core/domain/ports/persist-storage.port'

import type { CustomRequest } from '../models/custom-request'
import type { ViteEnvironmentVariables } from '../models/vite-env'

import { NetError } from '../models/net-error'

@injectable()
export class HttpClient implements HttpClientPort {
  private readonly ACCESS_TOKEN = 'access_token'
  private readonly REFRESH_TOKEN = 'refresh_token'
  protected readonly ORIGIN = this.env.get('VITE_API_URL')
  private _authWhiteList = ['/', '/decks/', '/courses/']

  constructor(
    @inject(PersistStoragePortToken) private readonly persistService: PersistStoragePort,
    @inject(EnvPortToken) private readonly env: EnvPort<ViteEnvironmentVariables>,
  ) {
    // if (!this.isAuthorized() && !this._authWhiteList.includes(window.location.pathname)) {
    //   this.goToAuth()
    // }
  }

  public async get<T>(req: HttpRequest): Promise<T> {
    return this._send<T>({ method: FetchMethod.get, ...req })
  }

  public async post<T>(req: HttpRequest): Promise<T> {
    return this._send<T>({ method: FetchMethod.post, ...req })
  }

  public async patch<T>(req: HttpRequest): Promise<T> {
    return this._send<T>({ method: FetchMethod.patch, ...req })
  }

  public async delete<T>(req: HttpRequest): Promise<T> {
    return this._send<T>({ method: FetchMethod.delete, ...req })
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
      throw new NetError({
        code: (error as NetError).code,
        status: (error as NetError).status,
        detail: (error as NetError).detail,
        validationErrors: (error as NetError).validationErrors,
      })
    }
  }

  protected _fetch({
    path,
    method = FetchMethod.get,
    body,
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
    const token = this.persistService.getAsString(isRefresh ? this.REFRESH_TOKEN : this.ACCESS_TOKEN)

    const headers: HeadersInit = [
      ['Content-Type', 'application/json;charset=utf-8'],
      ['x-custom-lang', 'ru'],
    ]

    headers.push(['Authorization', `Bearer ${token}`])

    return headers
  }

  private async _refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.persistService.getAsString(this.REFRESH_TOKEN)
      if (!refreshToken) {
        // this.goToAuth()
        return false
      }

      const response = await this._fetch({
        path: 'auth/refresh',
        method: FetchMethod.post,
        isRefresh: true,
      })

      const data = await response.json()

      if (!response.ok) {
        // this.goToAuth()
        return false
      }

      const tokens = data

      this.persistService.setPrimitive(this.ACCESS_TOKEN, tokens.token)
      this.persistService.setPrimitive(this.REFRESH_TOKEN, tokens.refreshToken)

      return true
    }
    catch (error) {
      console.error('Ошибка при обновлении токенов:', error)
      // this.goToAuth()
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
    return code >= ResponseCode.OK && code < 300
  }

  protected isAuthorized(): boolean {
    return this.persistService.has(this.ACCESS_TOKEN) && this.persistService.has(this.REFRESH_TOKEN)
  }

  protected goToAuth(): void {
    window.location.assign('/sign-in')
  }
}

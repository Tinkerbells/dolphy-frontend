import { jwtDecode } from 'jwt-decode'

import type { Env, I18n, PersistStorage, RouterService } from '@/common'

import { root } from '@/app/navigation/routes'
import { env, i18nInstance, router } from '@/common'
import { FetchMethod, ResponseCode } from '@/types/enums/http.enum'

import type { CustomRequest } from './custom-request'
import type { ViteEnvironmentVariables } from '../env/vite-env'

import { NetError } from './net-error'
import { localStorageInstance } from '../local-storage'

export interface HttpRequest {
  path: string
  body?: any
  signal?: AbortSignal
}

export interface HttpClient {
  get: <ResponseType>(req: HttpRequest) => Promise<ResponseType>
  post: <ResponseType>(req: HttpRequest) => Promise<ResponseType>
  patch: <ResponseType>(req: HttpRequest) => Promise<ResponseType>
  delete: <ResponseType>(req: HttpRequest) => Promise<ResponseType>
}

class HttpService implements HttpClient {
  private readonly ACCESS_TOKEN = 'access_token'
  private readonly REFRESH_TOKEN = 'refresh_token'
  protected readonly ORIGIN: string = this.env.get('VITE_API_URL')
  private _authWhiteList = ['/', '/decks/', '/sign-in', '/sign-up']

  constructor(
    private readonly env: Env<ViteEnvironmentVariables>,
    private readonly persistService: PersistStorage,
    private readonly i18n: I18n,
    private readonly router: RouterService,
  ) {
    if (!this.isAuthorized() && !this._authWhiteList.includes(window.location.pathname)) {
      this.goToAuth()
    }
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
          this.goToAuth()
        }
      }

      const response = await this._fetch(request)

      // Для Tanstack Query onSuccess
      if (this._isStatusNoContent(response.status)) {
        return {} as T
      }
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
    signal,
  }: CustomRequest & { isRefresh?: boolean }): Promise<Response> {
    const url = `${this.ORIGIN}/api/v1/${path}`

    if (method === FetchMethod.get) {
      return withHeaders
        ? fetch(url, { headers: this._makeHeaders(isRefresh), signal })
        : fetch(url, { signal })
    }

    return fetch(url, {
      method,
      headers: this._makeHeaders(isRefresh),
      body: JSON.stringify(body),
      signal,
    })
  }

  private _makeHeaders(isRefresh = false): HeadersInit {
    const token = this.persistService.getAsString(isRefresh ? this.REFRESH_TOKEN : this.ACCESS_TOKEN)
    const lang = this.i18n.getCurrentLanguage()

    const headers: HeadersInit = [
      ['Content-Type', 'application/json;charset=utf-8'],
      ['x-custom-lang', lang],
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

  protected _isStatusNoContent(code: number): boolean {
    return code === ResponseCode.NO_CONTENT
  }

  protected _isStatusOk(code: number): boolean {
    return code >= ResponseCode.OK && code < 300
  }

  protected isAuthorized(): boolean {
    return this.persistService.has(this.ACCESS_TOKEN) && this.persistService.has(this.REFRESH_TOKEN)
  }

  protected goToAuth(): void {
    router.navigate(root['sign-in'].$path())
  }
}

export const http = new HttpService(env, localStorageInstance, i18nInstance, router)

export interface CustomResponse<T> {
  data?: T
  detail?: any
  code: number
  status: string
}

export interface CustomRequest {
  /**
   * Путь запроса без начального слеша
   */
  path: string

  /** Данные для отправки */
  body?: any

  /** Метод запроса: get, post, patch и т.д. */
  method?: string

  /** Отправлять ли заголовки */
  withHeaders?: boolean
}

export interface AuthTokens {
  refresh_token: string
  access_token: string
}

export interface NetService {
  goToAuth: () => void
  isAuthorized: () => boolean
}

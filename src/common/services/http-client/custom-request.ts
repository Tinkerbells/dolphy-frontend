import type { HttpRequest } from './http-client'

export interface CustomRequest extends HttpRequest {
  /** Метод запроса: GET, POST, PATCH и т.д. */
  method?: string
  /** Отправлять ли заголовки */
  withHeaders?: boolean
}

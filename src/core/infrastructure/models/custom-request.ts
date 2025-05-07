import type { HttpRequest } from '@/core/domain/ports/http-client.port'

export interface CustomRequest extends HttpRequest {
  /** Метод запроса: GET, POST, PATCH и т.д. */
  method?: string
  /** Отправлять ли заголовки */
  withHeaders?: boolean
}

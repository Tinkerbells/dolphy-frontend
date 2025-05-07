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

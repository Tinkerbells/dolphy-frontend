export interface CustomResponse<T> {
  data?: T
  detail?: any
  code: number
  status: string
}

export interface NetRequest<T> {
  promise: Promise<T>
  isClosed: boolean
  controller: AbortController
  abort: () => void
  updatePromise: <K>(promise: Promise<K>) => NetRequest<K>
  /** With auto catch */
  quiet: () => NetRequest<T>
}

export interface CustomRequest {
  /**
   * Request address **without** leading slash.
   * Don't forget the backslash at the end
   */
  path: string

  /** Serializable send data */
  body?: any

  /** get | post | patch */
  method?: string

  withHeaders?: boolean

  /**
   * If the truth and the same request was already sent,
   * then the previous one is interrupted and send a new
   */
  force?: boolean

  /**
   * The identifier by which the service will optimize requests.
   * If the parameter is not specified,
   * then the request path will be used as the identifier.
   */
  key?: string

  controller?: AbortController
}

export interface AuthTokens {
  refresh_token: string
  access_token: string
}

export interface NetService {
  goToAuth: () => any
  isAuthorized: () => boolean
  // logIn: (code: string, controller?: AbortController) => NetRequest<void>
  // logOut: () => any
  abortRequests: (keys: RequestKey[]) => any
}

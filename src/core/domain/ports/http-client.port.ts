export const HttpClientPortToken = Symbol()

export interface HttpRequest {
  path: string
  body?: any
}

export interface HttpClientPort {
  get: <ResponseType>(req: HttpRequest) => Promise<ResponseType>
  post: <ResponseType>(req: HttpRequest) => Promise<ResponseType>
  patch: <ResponseType>(req: HttpRequest) => Promise<ResponseType>
  delete: <ResponseType>(req: HttpRequest) => Promise<ResponseType>
}

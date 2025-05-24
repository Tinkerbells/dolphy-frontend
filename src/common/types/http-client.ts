export interface HttpRequest {
  path: string
  body?: any
}

export interface HttpClient {
  get: <ResponseType>(req: HttpRequest) => Promise<ResponseType>
  post: <ResponseType>(req: HttpRequest) => Promise<ResponseType>
  patch: <ResponseType>(req: HttpRequest) => Promise<ResponseType>
  delete: <ResponseType>(req: HttpRequest) => Promise<ResponseType>
}

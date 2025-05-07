export interface CustomResponse<T> {
  data?: T
  detail?: any
  code: number
  status: string
}

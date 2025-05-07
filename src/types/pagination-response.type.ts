export class PaginationResponseDto<T> {
  data: T[]
  hasNextPage: boolean
}

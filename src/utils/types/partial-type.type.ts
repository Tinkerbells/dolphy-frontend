import type { Type } from './type'

export declare function PartialType<T>(classRef: Type<T>, options?: {
  skipNullProperties?: boolean
}): Type<Partial<T>>

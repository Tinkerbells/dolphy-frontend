import { format } from 'date-fns'

export function dateToPlainTransformer(dateFormat: string) {
  return function (params: TransformFnParams): MaybeType<string> {
    return params.value ? format(params.value, dateFormat).trim() : params.value
  }
}

export function dateToClassTransformer(params: TransformFnParams): MaybeType<Date> {
  return params.value ? new Date(params.value) : params.value
}

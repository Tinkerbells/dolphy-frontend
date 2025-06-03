import type { TransformFnParams } from 'class-transformer/types/interfaces'

import type { MaybeType } from '@/types'

export function lowerCaseTransformer(params: TransformFnParams): MaybeType<string> {
  return params.value?.toLowerCase().trim()
}

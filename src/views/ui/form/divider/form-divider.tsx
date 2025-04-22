import type { DividerProps } from '@tinkerbells/xenon-ui'

import { Divider } from '@tinkerbells/xenon-ui'

export type FormDividerProps = DividerProps

export function FormDivider({
  ...props
}: FormDividerProps) {
  return (
    <Divider {...props} />
  )
}

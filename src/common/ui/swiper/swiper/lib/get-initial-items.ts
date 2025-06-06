import type { ReactElement, ReactNode } from 'react'

import { Children, isValidElement } from 'react'

export function getInitialItems(children: ReactNode) {
  return Children.toArray(children).filter(isValidElement) as ReactElement[]
}

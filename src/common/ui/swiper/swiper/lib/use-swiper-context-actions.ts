import { useContext } from 'react'

import { SwiperActionContext } from '../ui'

export function useSwiperContextActions() {
  const context = useContext(SwiperActionContext)
  if (!context) {
    throw new Error(
      'useSwiperContextActions must be used within a SwiperProvider',
    )
  }
  return context
}

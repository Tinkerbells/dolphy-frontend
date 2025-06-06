import { useContext } from 'react'

import { SwiperItemContext } from '../ui'

export function useSwiperItem() {
  const context = useContext(SwiperItemContext)
  if (!context) {
    throw new Error('useSwiperItem must be used within a SwiperItemProvider')
  }
  return context
}

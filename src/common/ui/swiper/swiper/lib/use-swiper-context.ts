import { useContext } from 'react'

import { SwiperContext } from '../ui'

export function useSwiperContext() {
  const context = useContext(SwiperContext)
  if (!context) {
    throw new Error('useSwiperContext must be used within a SwiperProvider')
  }
  return context
}

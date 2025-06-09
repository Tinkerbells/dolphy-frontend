import { useCallback, useRef, useState } from 'react'

import type { SwiperRef } from '../ui'
import type { SwipeDirection } from '../api'

export function useSwiper() {
  const ref = useRef<SwiperRef>(null)
  const [disabled, setDisabled] = useState(false)

  const swipe = useCallback(
    async (direction: SwipeDirection) => {
      if (ref.current) {
        return await ref.current.swipe(direction)
      }
    },
    [ref],
  )

  const swiper = {
    disabled,
    ref,
    swipe,
    setDisabled,
  }

  return swiper
}

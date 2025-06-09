import type { MotionValue } from 'motion'

import type { SwipeDirection } from '../api'

export function setleaveValue(direction: SwipeDirection, leaveValue: MotionValue) {
  leaveValue.set(
    direction === 'left' || direction === 'right'
      ? 2000 * (direction === 'left' ? -1 : 1)
      : 2000 * (direction === 'up' ? -1 : 1),
  )
}

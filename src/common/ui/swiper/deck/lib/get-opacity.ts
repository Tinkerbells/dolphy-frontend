import { MotionValue } from 'motion'
import { SwipeDirection } from '@/shared/ui/swiper'

export const getOpacity = (
  orientation: SwipeDirection,
  xOpacity: MotionValue,
  yOpacity: MotionValue,
): MotionValue => {
  const horizontalDirections = ['right', 'left']
  const verticalDirections = ['up', 'down']
  if (horizontalDirections.includes(orientation)) {
    return xOpacity
  } else if (verticalDirections.includes(orientation)) {
    return yOpacity
  } else {
    throw new Error(`Invalid direction: ${orientation}`)
  }
}

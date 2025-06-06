import type { SwipeDirection } from '../api'

export function getDirection(offset: { x: number, y: number }, boundary: number): SwipeDirection | null {
  const absX = Math.abs(offset.x)
  const absY = Math.abs(offset.y)
  const halfOffsetBoundary = boundary / 2

  if (absX <= halfOffsetBoundary && absY <= halfOffsetBoundary) {
    return null
  }

  if (absX > absY) {
    if (offset.x > halfOffsetBoundary) {
      return 'right'
    }
    else if (offset.x < -halfOffsetBoundary) {
      return 'left'
    }
  }
  else {
    if (offset.y > halfOffsetBoundary) {
      return 'down'
    }
    else if (offset.y < -halfOffsetBoundary) {
      return 'up'
    }
  }

  return null
}

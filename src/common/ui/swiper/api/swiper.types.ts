import type { ReactNode } from 'react'
import type { MotionValue, PanInfo } from 'motion/react'

export type SwipeDirection = 'right' | 'left' | 'up' | 'down'

export interface SwipeType {
  direction: SwipeDirection
  index: number
}

export interface SwiperProviderProps {
  onSwipe: (swipe: SwipeType) => Promise<void> | void
  offsetBoundary?: number
}

export interface SwiperItemContextType {
  x: MotionValue
  y: MotionValue
  offsetBoundary: number
}

export interface SwiperContextType {
  leaveX: MotionValue
  leaveY: MotionValue
  offsetBoundary: number
}

export interface SwiperActionsType {
  handleSwipe: (direction: SwipeDirection) => Promise<void> | void
  onDrag?: (_e: any, info: PanInfo) => void
}

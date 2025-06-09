import type { ReactNode } from 'react'
import type { MotionValue, PanInfo } from 'motion/react'

export type SwipeDirection = 'right' | 'left' | 'up' | 'down'

export interface SwiperState {
  disabled: boolean
  disabledRedo: boolean
  disabledUndo: boolean
}

export enum SwiperActionTypes {
  SET_DISABLED = 'SET_DISABLED',
  SET_REDO_DISABLED = 'SET_REDO_DISABLED',
  SET_UNDO_DISABLED = 'SET_UNDO_DISABLED',
}

export type SwiperAction =
  | { type: SwiperActionTypes.SET_DISABLED, payload: boolean }
  | { type: SwiperActionTypes.SET_REDO_DISABLED, payload: boolean }
  | { type: SwiperActionTypes.SET_UNDO_DISABLED, payload: boolean }

export interface SwipeType {
  direction: SwipeDirection
  id: number
  children: ReactNode
}

export interface SwiperProviderProps {
  onSwipe: (swipe: SwipeType) => void
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
  handleSwipe: (direction: SwipeDirection) => void
  onDrag?: (_e: any, info: PanInfo) => void
}

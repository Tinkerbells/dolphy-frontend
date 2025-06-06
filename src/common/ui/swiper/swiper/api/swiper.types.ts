import { MotionValue, PanInfo } from 'motion'
import { Dispatch, ReactNode, SetStateAction } from 'react'

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
  | { type: SwiperActionTypes.SET_DISABLED; payload: boolean }
  | { type: SwiperActionTypes.SET_REDO_DISABLED; payload: boolean }
  | { type: SwiperActionTypes.SET_UNDO_DISABLED; payload: boolean }

export type SwipeType = {
  direction: SwipeDirection
  id: number
  children: ReactNode
}

export type SwiperProviderProps = {
  onSwipe: (swipe: SwipeType) => void
  offsetBoundary?: number
}

export type SwiperItemContextType = {
  x: MotionValue
  y: MotionValue
  offsetBoundary: number
}

export type SwiperContextType = {
  leaveX: MotionValue
  leaveY: MotionValue
  offsetBoundary: number
}

export type SwiperActionsType = {
  handleSwipe: (direction: SwipeDirection) => void
  onDrag?: (_e: any, info: PanInfo) => void
}

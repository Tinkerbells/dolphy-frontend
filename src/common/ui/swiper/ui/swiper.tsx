import type { PanInfo } from 'motion/react'
import type {
  HTMLAttributes,
  ReactElement,
} from 'react'

import { Box } from '@mui/material'
import { AnimatePresence, useMotionValue } from 'motion/react'
import React, {
  createContext,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import type {
  SwipeDirection,
  SwiperActionsType,
  SwiperContextType,
  SwipeType,
} from '../api'

import { setleaveValue } from '../lib'
import { SwiperItem } from './swiper-item'
import { ITEMS_PER_VIEW, OFFSET_BOUNDARY } from '../config'

export const SwiperContext = createContext<SwiperContextType | null>(null)
export const SwiperActionContext = createContext<SwiperActionsType | null>(null)

interface SwiperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrag'> {
  items: ReactElement[]
  currentIndex: number
  isProcessing?: boolean
  onDrag?: (_e: any, info: PanInfo) => void
  onSwipe?: (swipe: SwipeType) => Promise<void> | void
  offsetBoundary?: number
  itemsPerView?: number
  onDisabledChange?: (disabled: boolean) => void
}

export interface SwiperRef {
  swipe: (direction: SwipeDirection) => Promise<void> | void
}

export const Swiper = forwardRef<SwiperRef, SwiperProps>(
  (
    {
      items,
      currentIndex,
      isProcessing = false,
      className,
      onDrag,
      onSwipe,
      offsetBoundary = OFFSET_BOUNDARY,
      itemsPerView = ITEMS_PER_VIEW,
      onDisabledChange,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null)

    const leaveX = useMotionValue(0)
    const leaveY = useMotionValue(0)

    const leaveMap = useMemo(
      () => ({
        right: leaveX,
        left: leaveX,
        up: leaveY,
        down: leaveY,
      }),
      [leaveX, leaveY],
    )

    const disabled = isProcessing || items.length === 0

    const notifyDisabledChange = useCallback(() => {
      if (onDisabledChange) {
        onDisabledChange(disabled)
      }
    }, [disabled, onDisabledChange])

    React.useEffect(() => {
      notifyDisabledChange()
    }, [notifyDisabledChange])

    const handleSwipe = useCallback(
      async (direction: SwipeDirection) => {
        if (items.length === 0 || isProcessing) {
          return
        }

        try {
          setleaveValue(direction, leaveMap[direction])

          if (onSwipe) {
            await onSwipe({
              direction,
              index: currentIndex,
            })
          }
        }
        catch (error) {
          console.error('Swipe handling error:', error)
        }
      },
      [onSwipe, items, currentIndex, leaveMap, isProcessing],
    )

    useImperativeHandle(
      ref,
      () => ({
        swipe: handleSwipe,
      }),
      [handleSwipe],
    )

    const value = useMemo(
      () => ({
        leaveX,
        leaveY,
        offsetBoundary,
      }),
      [leaveX, leaveY, offsetBoundary],
    )

    const actions = useMemo(
      () => ({
        onDrag,
        handleSwipe,
      }),
      [handleSwipe, onDrag],
    )

    const onExitComplete = useCallback(() => {
      leaveX.set(0)
      leaveY.set(0)
    }, [leaveX, leaveY])

    const safeCurrentIndex = Math.min(currentIndex, Math.max(0, items.length - 1))
    const displayedItems = items.slice(safeCurrentIndex, safeCurrentIndex + itemsPerView)
    console.log('displayedItems', displayedItems)

    return (
      <SwiperContext.Provider value={value}>
        <SwiperActionContext.Provider value={actions}>
          <Box
            ref={internalRef}
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className={className}
            {...props}
          >
            <AnimatePresence onExitComplete={onExitComplete} initial={false}>
              {displayedItems.map((item, index) => {
                const zIndex = items.length - index
                const key = `swiper-item-${item.key ?? safeCurrentIndex + index}`
                if (index === 0) {
                  return (
                    <SwiperItem
                      id={safeCurrentIndex + index}
                      zIndex={zIndex}
                      key={key}
                    >
                      {item}
                    </SwiperItem>
                  )
                }
                return (
                  <Box
                    style={{ zIndex }}
                    sx={{
                      position: 'absolute',
                    }}
                    key={key}
                    data-testid="notactive-card"
                  >
                    {item}
                  </Box>
                )
              })}
            </AnimatePresence>
          </Box>
        </SwiperActionContext.Provider>
      </SwiperContext.Provider>
    )
  },
)

Swiper.displayName = 'Swiper'

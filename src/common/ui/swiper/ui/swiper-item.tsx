import type {
  ReactElement,
} from 'react'
import type {
  HTMLMotionProps,
  PanInfo,
} from 'motion/react'

import {
  easeInOut,
  motion,
  useMotionValue,
  useTransform,
} from 'motion/react'
import {
  cloneElement,
  createContext,
  forwardRef,
  useCallback,
  useMemo,
} from 'react'

import type { SwipeDirection, SwiperItemContextType } from '../api'

import styles from './swiper-item.module.css'
import { getDirection, useSwiperContext, useSwiperContextActions } from '../lib'

export const SwiperItemContext = createContext<SwiperItemContextType | null>(
  null,
)

export interface SwiperItemProps extends Omit<HTMLMotionProps<'div'>, 'id'> {
  zIndex?: number
  id: number
}

export const SwiperItem = forwardRef<HTMLDivElement, SwiperItemProps>(
  ({ zIndex: index, children, className, id, ...props }, ref) => {
    const { leaveX, leaveY, offsetBoundary } = useSwiperContext()
    const { handleSwipe, onDrag } = useSwiperContextActions()
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const rotate = useTransform(
      x,
      [-offsetBoundary, 0, offsetBoundary],
      [15, 0, -15],
    )

    const onSwipe = useCallback(
      (direction: SwipeDirection) => {
        handleSwipe(direction)
      },
      [handleSwipe],
    )

    const handleDrag = useCallback(
      (_e: any, info: PanInfo) => {
        onDrag && onDrag(_e, info)
      },
      [onDrag],
    )

    const onDragEnd = useCallback(
      (_e: any, info: PanInfo) => {
        const { offset } = info
        const direction = getDirection(offset, offsetBoundary * 2) // Multiple because function divide by two
        switch (direction) {
          case 'right':
            onSwipe('right')
            break
          case 'left':
            onSwipe('left')
            break
          case 'down':
            onSwipe('down')
            break
          case 'up':
            onSwipe('up')
            break
          default:
            break
        }
      },
      [onSwipe, offsetBoundary],
    )

    const value = useMemo(
      () => ({
        x,
        y,
        offsetBoundary,
      }),
      [x, y, offsetBoundary],
    )

    return (
      <SwiperItemContext.Provider value={value}>
        <motion.div
          drag
          ref={ref}
          animate={{ scale: 1 }}
          dragElastic={0.6}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragTransition={{
            bounceStiffness: 1000,
            bounceDamping: 10,
          }}
          onDrag={handleDrag}
          onDragEnd={onDragEnd}
          initial={{
            scale: 0.8,
          }}
          style={{
            x,
            y,
            rotate,
            zIndex: index,
          }}
          exit={{
            x: leaveX.get(),
            y: leaveY.get(),
            opacity: 0,
            scale: 0,
            transition: { duration: 0.4, ease: easeInOut },
          }}
          data-testid="active-card"
          className={styles.swiperItem}
          {...props}
        >
          {cloneElement(children as ReactElement, {
            active: true,
          })}
        </motion.div>
      </SwiperItemContext.Provider>
    )
  },
)

SwiperItem.displayName = 'SwiperItem'

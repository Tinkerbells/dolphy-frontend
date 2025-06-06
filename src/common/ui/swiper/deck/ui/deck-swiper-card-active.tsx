import classNames from 'classnames'
import { motion, useTransform } from 'motion'
import { FC, useMemo, useState } from 'react'
import { CardSizes, DeckCard, DeckCardProps } from '@/shared/ui/deck-card'
import { Easiness } from '@/shared/ui/easiness'
import { SwipeDirection, useSwiperItem } from '@/shared/ui/swiper'
import { getEasiness, getPositionStyles } from '../lib'
import styles from './deck-swiper-card.module.scss'

export const DeckSwiperCardActive: FC<DeckCardProps> = ({ card }) => {
  const [flip, setFlip] = useState(false)
  const [animate, setAnimate] = useState(false)

  const { x, y, offsetBoundary } = useSwiperItem()

  const offsetX = useTransform(() =>
    Math.abs(x.get()) > Math.abs(y.get()) ? x.get() : 0,
  )

  const offsetY = useTransform(() =>
    Math.abs(y.get()) > Math.abs(x.get()) ? y.get() : 0,
  )

  const orientations = useMemo(
    () => ['right', 'left', 'up', 'down'] as SwipeDirection[],
    [],
  )

  const opacityMap = {
    right: useTransform(offsetX, [0, offsetBoundary], [0, 1]),
    left: useTransform(offsetX, [-offsetBoundary, 0], [1, 0]),
    up: useTransform(offsetY, [-offsetBoundary, 0], [1, 0]),
    down: useTransform(offsetY, [0, offsetBoundary], [0, 1]),
  }

  const handleFlip = () => {
    setFlip(prev => !prev)
    if (!animate) {
      setAnimate(!animate)
    }
  }

  return (
    <div className="flip flex justify-center">
      <div
        className={classNames(
          styles['flip-card'],
          'relative flex aspect-[100/125] items-center justify-center',
          CardSizes['l'],
        )}
      >
        <motion.div
          whileTap={{ scale: 1.05, cursor: 'grabbing' }}
          onTap={handleFlip}
          className={classNames(styles['flip-card-inner'], 'h-full w-full')}
          initial={false}
          transition={{ duration: 0.2, animationDirection: 'normal' }}
          animate={{ rotateY: flip ? 180 : 360 }}
        >
          <DeckCard
            card={card}
            size="l"
            type={'front'}
            className={classNames(
              styles['flip-card-front'],
              'flip-card-front absolute',
            )}
          />
          <DeckCard
            card={card}
            size="l"
            type={'back'}
            className={classNames(
              styles['flip-card-back'],
              'flip-card-front absolute',
            )}
          />
        </motion.div>
      </div>
      {orientations.map(orientaion => (
        <motion.div
          key={`orientaion-${orientaion}`}
          className={classNames('absolute', getPositionStyles(orientaion))}
          style={{ opacity: opacityMap[orientaion] }}
        >
          <Easiness
            className="m-6 px-6 py-2.5"
            easiness={getEasiness(orientaion)}
          />
        </motion.div>
      ))}
    </div>
  )
}

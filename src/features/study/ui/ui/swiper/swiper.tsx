import { useMemo } from 'react'
import { Box } from '@mui/material'

import type { SwipeType } from '@/common'
import type { FsrsCardWithContent } from '@/features/fsrs/models'

import { Swiper, useSwiper } from '@/common'

import styles from './swiper.module.css'
import { SwiperStudyCard } from './swiper-card'
import { StudySwiperControls } from './swiper-controls'

interface StudySwiperProps {
  cards: FsrsCardWithContent[]
  currentIndex: number
  isProcessing: boolean
  handleSwipe: (swipe: SwipeType) => Promise<void>
}

export function StudySwiper({ cards, currentIndex, isProcessing, handleSwipe }: StudySwiperProps) {
  const {
    ref: swiperRef,
    swipe,
    disabled,
  } = useSwiper()

  const swiperItems = useMemo(() => {
    return cards.map((cardData, index) => (
      <SwiperStudyCard
        key={`study-card-${cardData.id}-${index}`}
        cardData={cardData}
      />
    ))
  }, [cards])

  return (
    <Box sx={{ mb: 3, height: '100%', width: '100%', position: 'relative' }}>
      <Swiper
        ref={swiperRef}
        items={swiperItems}
        currentIndex={currentIndex}
        isProcessing={isProcessing}
        onSwipe={handleSwipe}
        itemsPerView={2}
        offsetBoundary={150}
        className={styles.studySwiper}
      />
      <StudySwiperControls swipe={swipe} disabled={disabled || isProcessing} />
    </Box>
  )
}

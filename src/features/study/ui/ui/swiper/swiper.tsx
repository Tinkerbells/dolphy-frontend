import { Box } from '@mui/material'

import type { SwipeType } from '@/common'
import type { FsrsCardWithContent } from '@/features/fsrs/models'

import '@tinkerbells/swipify/styles.css'

import { Swiper, useSwiper } from '@/common'

import styles from './swiper.module.css'
import { SwiperStudyCard } from './swiper-card'
import { StudySwiperControls } from './swiper-controls'

interface StudySwiperProps {
  cards: FsrsCardWithContent[]
  handleSwipe: (swipe: SwipeType) => Promise<void>
}

export function StudySwiper({ cards, handleSwipe }: StudySwiperProps) {
  const {
    ref: swiperRef,
    swipe,
  } = useSwiper()

  return (
    <Box sx={{ mb: 3, height: '100%', width: '100%', position: 'relative' }}>
      <Swiper
        ref={swiperRef}
        onSwipe={handleSwipe}
        itemsPerView={2}
        offsetBoundary={150}
        className={styles.studySwiper}
      >
        {cards.map((cardData, index) => (
          <SwiperStudyCard
            key={`study-card-${cardData.id}-${index}`}
            cardData={cardData}
          />
        ))}
      </Swiper>
      <StudySwiperControls swipe={swipe} disabled={false} />
    </Box>
  )
}

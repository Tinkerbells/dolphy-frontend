import { FC } from 'react'
import { DeckCardProps } from '@/shared/ui/deck-card'
import { DeckSwiperCardActive } from './deck-swiper-card-active'
import { DeckSwiperCardDisabled } from './deck-swiper-card-disabled'

export const DeckSwiperCard: FC<DeckCardProps & { active?: boolean }> = ({
  active,
  card,
}) => {
  if (active) {
    return <DeckSwiperCardActive card={card} />
  }
  return <DeckSwiperCardDisabled card={card} />
}

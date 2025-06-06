import classNames from 'classnames'
import { FC, memo } from 'react'
import { CardSizes, DeckCard, DeckCardProps } from '@/shared/ui/deck-card'

export const DeckSwiperCardDisabled: FC<DeckCardProps> = memo(({ card }) => {
  return (
    <div
      className={classNames(
        'relative flex aspect-[100/125] items-center justify-center',
        CardSizes['l'],
      )}
    >
      <DeckCard
        card={card}
        size="l"
        type={'front'}
        className={classNames('absolute opacity-20')}
      />
    </div>
  )
})

DeckSwiperCardDisabled.displayName = 'DeckSwiperCardDisabled'

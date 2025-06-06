import { useState } from 'react'
import { Progress } from '@telegram-apps/telegram-ui'

import type {
  SwipeDirection,
  SwipeType,
} from '@/shared/ui/swiper'

import { Button } from '@/shared/ui/button'
import { Easiness } from '@/shared/ui/easiness'
import { ArrowRedo, ArrowUndo } from '@/shared/ui/icons'
import {
  Swiper,
  useSwiper,
} from '@/shared/ui/swiper'

import { mockCards } from '../config'
import { DeckSwiperCard } from './deck-swiper-card'

export type ResultType = { [k in SwipeDirection]: number }

export function DeckSiwper() {
  const [progress, setProgress] = useState(0)

  const {
    ref,
    undo,
    redo,
    swipe,
    dispatch,
    disabled,
    disabledRedo,
    disabledUndo,
  } = useSwiper()

  const directions: {
    direction: SwipeDirection
    label: 'good' | 'again' | 'easy' | 'hard'
  }[] = [
    { direction: 'left', label: 'again' },
    { direction: 'down', label: 'hard' },
    { direction: 'right', label: 'good' },
    { direction: 'up', label: 'easy' },
  ]

  const cards = Object.keys(mockCards).map((key, i) => {
    const animal = mockCards[key as keyof typeof mockCards]
    return {
      id: `${i + 1}`,
      front: {
        text: 'What\'s this animal?',
        imageUrl: animal.image,
      },
      back: {
        text: animal.name,
        example: animal.example,
        imageUrl: animal.image,
      },
    }
  })

  const updateProgress = (newId: number) => {
    const clampedId = Math.max(0, Math.min(newId, cards.length - 1))
    setProgress((clampedId / cards.length) * 100)
  }

  const handleUndo = () => {
    const currentId = Math.floor((progress * cards.length) / 100)
    updateProgress(currentId - 1)
    undo()
  }

  const handleRedo = () => {
    const currentId = Math.floor((progress * cards.length) / 100)
    updateProgress(currentId + 1)
    redo()
  }

  const onSwipe = (swipe: SwipeType) => {
    setProgress(((swipe.id + 1) / cards.length) * 100)
  }

  console.log(disabled, disabledUndo, disabledRedo)

  return (
    <div className="mb-20 flex h-[calc(100%-5rem)] w-full flex-col items-center justify-between gap-2 overflow-hidden pb-3 pt-6">
      <div className="flex w-full flex-col items-center gap-8">
        <div className="flex w-full items-end justify-between px-7">
          <Button
            disabled={disabledUndo}
            size="m"
            type="icon"
            onClick={handleUndo}
          >
            <ArrowUndo />
          </Button>
          <Button
            disabled={disabledRedo}
            size="m"
            type="icon"
            onClick={handleRedo}
          >
            <ArrowRedo />
          </Button>
        </div>
        <Progress className="w-80" value={progress} />
      </div>
      <Swiper history ref={ref} onSwipe={onSwipe} dispatch={dispatch}>
        {cards.map((card, i) => (
          <DeckSwiperCard card={card} key={`swiper-item-${i}`} />
        ))}
      </Swiper>
      <div className="flex items-center justify-center gap-1">
        {directions.map(d => (
          <Easiness
            key={`swiper-button-${d.direction}`}
            onClick={() => swipe(d.direction)}
            easiness={d.label}
            disabled={disabled}
            role="button"
            className="w-[4.75rem] py-8"
          />
        ))}
      </div>
    </div>
  )
}

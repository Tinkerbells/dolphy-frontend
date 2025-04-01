import type { Card } from './card'

// src/domain/deck.ts
import { currentDatetime } from '../lib/datetime'

export type DeckTitle = string
export type DeckDescription = string

export interface Deck {
  id: UniqueId
  title: DeckTitle
  description: DeckDescription
  created: DateTimeString
  lastStudied?: DateTimeString
  owner: UniqueId // User ID
  tags: string[]
  cardCount: number
  newCount: number
  reviewCount: number
  learningCount: number
}

export function createDeck(
  title: DeckTitle,
  description: DeckDescription = '',
  owner: UniqueId,
  tags: string[] = [],
): Deck {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    created: currentDatetime(),
    owner,
    tags,
    cardCount: 0,
    newCount: 0,
    reviewCount: 0,
    learningCount: 0,
  }
}

export function updateDeckStats(deck: Deck, cards: Card[]): Deck {
  const now = new Date()

  // Count cards by status
  const newCount = cards.filter(c => c.status === 'new').length
  const reviewCount = cards.filter(c => c.status === 'review' && isCardDue(c, now)).length
  const learningCount = cards.filter(c =>
    (c.status === 'learning' || c.status === 'relearning')
    && isCardDue(c, now),
  ).length

  return {
    ...deck,
    cardCount: cards.length,
    newCount,
    reviewCount,
    learningCount,
  }
}

export function updateDeckLastStudied(deck: Deck): Deck {
  return {
    ...deck,
    lastStudied: currentDatetime(),
  }
}

// Helper function to check if a card is due based on a reference date
function isCardDue(card: Card, referenceDate: Date): boolean {
  if (!card.dueDate)
    return true

  const dueDate = new Date(card.dueDate)
  return referenceDate >= dueDate
}

export function getDueCardsCount(deck: Deck, cards: Card[]): number {
  const now = new Date()
  return cards.filter(card =>
    card.deckId === deck.id
    && (card.status === 'new' || isCardDue(card, now)),
  ).length
}

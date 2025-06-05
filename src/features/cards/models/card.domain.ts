import type { Deck, User } from '../external'

export class Card {
  id: string
  question: string
  answer: string
  source: string
  metadata?: Record<string, any>
  deckId: Deck['id']
  userId: User['id']
  deleted: boolean
  createdAt: string
  updatedAt: string
}

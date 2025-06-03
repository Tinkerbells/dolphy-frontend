export const cardStates = ['New', 'Learning', 'Review', 'Relearning'] as const
export type CardState = typeof cardStates[number]

/**
 * Модель карточки для обучения
 */
export class Card {
  id: string
  due: Date
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  state: CardState
  last_review?: Date
  suspended: Date
  userId: string
  deckId: string
  deleted: boolean
  createdAt: Date
  front?: string
  back?: string
}

/**
 * Модель содержимого карточки
 */
export class CardNote {
  id: string
  cardId: string
  question: string
  answer: string
  source: string
  extend?: Record<string, any>
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Карточка с содержимым
 */
export interface CardWithContent {
  card: Card
  note: CardNote
}

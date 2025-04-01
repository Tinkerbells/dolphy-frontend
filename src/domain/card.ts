// src/domain/card.ts
import { currentDatetime } from '../lib/datetime'

export type CardFace = string // Text content for a card face

export interface Card {
  id: UniqueId
  front: CardFace
  back: CardFace
  tags: string[]
  deckId: UniqueId
  created: DateTimeString
  lastReviewed?: DateTimeString
  difficulty: DifficultyLevel
  status: StudyStatus
  dueDate?: DateTimeString
  lapses: number // Number of times the card was forgotten
  interval: number // Current interval in days
}

export function createCard(
  front: CardFace,
  back: CardFace,
  deckId: UniqueId,
  tags: string[] = [],
): Card {
  return {
    id: crypto.randomUUID(),
    front,
    back,
    tags,
    deckId,
    created: currentDatetime(),
    difficulty: 0, // New card
    status: 'new',
    lapses: 0,
    interval: 0,
  }
}

export function updateCardDifficulty(
  card: Card,
  newDifficulty: DifficultyLevel,
): Card {
  const now = currentDatetime()

  // Simple spaced repetition algorithm:
  // - Interval increases based on difficulty (easier = longer intervals)
  // - New interval is calculated as a factor of the previous interval
  const difficultyFactor = 2.5 - (newDifficulty * 0.3) // Range: 1.0 to 2.5
  let newInterval = card.interval

  if (card.status === 'new') {
    newInterval = 1 // First interval for new cards is 1 day
  }
  else {
    newInterval = Math.max(1, Math.round(card.interval * difficultyFactor))
  }

  // Calculate new due date based on interval
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + newInterval)

  // Update status based on difficulty
  let newStatus: StudyStatus = card.status
  let newLapses = card.lapses

  if (newDifficulty <= 1) {
    // Failed - card needs relearning
    newStatus = 'relearning'
    newLapses = card.lapses + 1
    newInterval = 0 // Reset interval for failed cards
  }
  else if (card.status === 'new' || card.status === 'relearning') {
    newStatus = 'learning'
  }
  else {
    newStatus = 'review'
  }

  return {
    ...card,
    difficulty: newDifficulty,
    lastReviewed: now,
    status: newStatus,
    dueDate: dueDate.toISOString(),
    interval: newInterval,
    lapses: newLapses,
  }
}

export function isCardDue(card: Card): boolean {
  if (!card.dueDate)
    return true // If no due date, always due

  const now = new Date()
  const due = new Date(card.dueDate)
  return now >= due
}

export function sortCardsByDueness(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    // First sort by status (new > relearning > learning > review)
    const statusOrder: Record<StudyStatus, number> = {
      new: 0,
      relearning: 1,
      learning: 2,
      review: 3,
    }

    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status]
    }

    // Then sort by due date
    if (!a.dueDate)
      return -1
    if (!b.dueDate)
      return 1

    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })
}

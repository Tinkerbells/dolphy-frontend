import type { Card } from './card'

// Domain model for Study Session
export interface StudySession {
  id: UniqueId
  deckId: UniqueId
  userId: UniqueId
  started: DateTimeString
  ended?: DateTimeString
  cardsStudied: number
  cardsCorrect: number
}

// Value object for creating a new study session
export interface CreateStudySessionDTO {
  deckId: UniqueId
  userId: UniqueId
}

// Value object for a card due for study
export interface DueCard extends Card {
  dueDate: DateTimeString
}

// Study settings for spaced repetition
export interface StudySettings {
  newCardsPerDay: number
  reviewsPerDay: number
  easeModifier: number
  intervalModifier: number
}

// Study statistics
export interface StudyStats {
  totalCards: number
  newCards: number
  learningCards: number
  reviewCards: number
  averageCorrectRate: number
  streakDays: number
  totalTimeStudied: number // in minutes
}

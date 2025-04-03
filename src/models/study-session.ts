// src/models/study.ts

export interface StudySession {
  id: UniqueId
  deckId: UniqueId
  userId: UniqueId
  started: DateTimeString
  ended?: DateTimeString
  cardsStudied: number
  cardsCorrect: number
}

export interface CreateStudySessionDTO {
  deckId: UniqueId
  userId: UniqueId
}

export interface StudyStats {
  totalCards: number
  newCards: number
  learningCards: number
  reviewCards: number
  averageCorrectRate: number
  streakDays: number
  totalTimeStudied: number // в минутах
}

export interface CardReview {
  cardId: UniqueId
  sessionId: UniqueId
  timestamp: DateTimeString
  answer: 'again' | 'hard' | 'good' | 'easy'
  timeSpent: number // в миллисекундах
  prevDifficulty: DifficultyLevel
  newDifficulty: DifficultyLevel
  prevStatus: StudyStatus
  newStatus: StudyStatus
}

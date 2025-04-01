import { currentDatetime } from '../lib/datetime'

export type ReviewType = 'again' | 'hard' | 'good' | 'easy'
export type SessionStatus = 'active' | 'completed' | 'paused'

export interface CardReview {
  cardId: UniqueId
  reviewType: ReviewType
  timestamp: DateTimeString
  timeSpent: number // Time spent in milliseconds
}

export interface StudySession {
  id: UniqueId
  deckId: UniqueId
  startTime: DateTimeString
  endTime?: DateTimeString
  status: SessionStatus
  cardsStudied: number
  cardsCorrect: number // Cards marked as "good" or "easy"
  reviews: CardReview[]
  currentCardIndex?: number
}

export function createStudySession(deckId: UniqueId): StudySession {
  return {
    id: crypto.randomUUID(),
    deckId,
    startTime: currentDatetime(),
    status: 'active',
    cardsStudied: 0,
    cardsCorrect: 0,
    reviews: [],
  }
}

export function addReview(
  session: StudySession,
  cardId: UniqueId,
  reviewType: ReviewType,
  timeSpent: number,
): StudySession {
  const newReview: CardReview = {
    cardId,
    reviewType,
    timestamp: currentDatetime(),
    timeSpent,
  }

  const isCorrect = reviewType === 'good' || reviewType === 'easy'

  return {
    ...session,
    reviews: [...session.reviews, newReview],
    cardsStudied: session.cardsStudied + 1,
    cardsCorrect: session.cardsCorrect + (isCorrect ? 1 : 0),
  }
}

export function completeSession(session: StudySession): StudySession {
  return {
    ...session,
    endTime: currentDatetime(),
    status: 'completed',
  }
}

export function pauseSession(session: StudySession): StudySession {
  return {
    ...session,
    status: 'paused',
  }
}

export function resumeSession(session: StudySession): StudySession {
  return {
    ...session,
    status: 'active',
  }
}

export function getSessionDuration(session: StudySession): number {
  const start = new Date(session.startTime).getTime()
  const end = session.endTime ? new Date(session.endTime).getTime() : Date.now()
  return end - start // Duration in milliseconds
}

export function getSessionAccuracy(session: StudySession): number {
  if (session.cardsStudied === 0)
    return 0
  return (session.cardsCorrect / session.cardsStudied) * 100
}

// Map review type to difficulty level for updating cards
export function reviewTypeToDifficulty(reviewType: ReviewType): DifficultyLevel {
  switch (reviewType) {
    case 'again': return 1
    case 'hard': return 2
    case 'good': return 3
    case 'easy': return 5
    default: return 3
  }
}

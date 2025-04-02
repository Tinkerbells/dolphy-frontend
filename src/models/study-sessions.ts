// Study session domain model

export type SessionStatus = 'active' | 'completed' | 'paused'
export type CardAnswer = 'again' | 'hard' | 'good' | 'easy'

export interface CardReviewDto {
  id: UniqueId
  sessionId: UniqueId
  cardId: UniqueId
  answer: CardAnswer
  timeSpent: number // Time in milliseconds
  reviewedAt: DateTimeString
  previousDifficulty: DifficultyLevel
  newDifficulty: DifficultyLevel
  previousStatus: StudyStatus
  newStatus: StudyStatus
}

export interface StudySessionDto {
  id: UniqueId
  deckId: UniqueId
  userId: UniqueId
  status: SessionStatus
  startedAt: DateTimeString
  endedAt?: DateTimeString
  totalCards: number
  completedCards: number
  newCardsCount: number
  learningCardsCount: number
  reviewCardsCount: number
  relearningCardsCount: number
  reviews: CardReviewDto[]
}

export class StudySessions {
  sessions: StudySessionDto[] = []

  constructor(sessions: StudySessionDto[] = []) {
    this.sessions = sessions
  }

  setSessions(sessions: StudySessionDto[]) {
    this.sessions = sessions
  }

  getSessionById(sessionId: string): StudySessionDto | undefined {
    return this.sessions.find(session => session.id === sessionId)
  }

  getSessionsByDeck(deckId: string): StudySessionDto[] {
    return this.sessions.filter(session => session.deckId === deckId)
  }

  getActiveSession(deckId: string): StudySessionDto | undefined {
    return this.sessions.find(session =>
      session.deckId === deckId
      && session.status === 'active',
    )
  }

  getRecentSessions(limit: number = 10): StudySessionDto[] {
    return [...this.sessions]
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limit)
  }

  getStatistics(deckId: string) {
    const deckSessions = this.getSessionsByDeck(deckId)

    const totalCards = deckSessions.reduce((sum, session) => sum + session.completedCards, 0)
    const totalTime = deckSessions.reduce((sum, session) => {
      if (session.endedAt) {
        return sum + (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime())
      }
      return sum
    }, 0)

    return {
      totalCards,
      totalTimeMs: totalTime,
      averageTimePerCardMs: totalCards > 0 ? totalTime / totalCards : 0,
      sessionsCount: deckSessions.length,
    }
  }
}

import { v4 as uuidv4 } from 'uuid'
import { injectable } from 'inversify'

import type { CreateStudySessionDTO, StudySession, StudyStats } from '../domain/study'

import { currentDatetime } from '../lib/datetime'

@injectable()
export class StudySessionRepository {
  private studySessions: StudySession[] = []

  // Create a new study session
  async createStudySession(sessionData: CreateStudySessionDTO): Promise<StudySession> {
    // Simulate API call
    await this.delay(400)

    const newSession: StudySession = {
      id: uuidv4(),
      deckId: sessionData.deckId,
      userId: sessionData.userId,
      started: currentDatetime(),
      cardsStudied: 0,
      cardsCorrect: 0,
    }

    this.studySessions.push(newSession)
    return newSession
  }

  // Update a study session
  async updateStudySession(sessionId: UniqueId, data: Partial<StudySession>): Promise<StudySession | undefined> {
    // Simulate API call
    await this.delay(300)

    const index = this.studySessions.findIndex(session => session.id === sessionId)
    if (index === -1)
      return undefined

    const updatedSession = {
      ...this.studySessions[index],
      ...data,
    }

    this.studySessions[index] = updatedSession
    return updatedSession
  }

  // End a study session
  async endStudySession(sessionId: UniqueId): Promise<StudySession | undefined> {
    // Simulate API call
    await this.delay(300)

    const index = this.studySessions.findIndex(session => session.id === sessionId)
    if (index === -1)
      return undefined

    const updatedSession = {
      ...this.studySessions[index],
      ended: currentDatetime(),
    }

    this.studySessions[index] = updatedSession
    return updatedSession
  }

  // Get all study sessions for a user
  async getStudySessionsByUser(userId: UniqueId): Promise<StudySession[]> {
    // Simulate API call
    await this.delay(500)

    return this.studySessions.filter(session => session.userId === userId)
  }

  // Get all study sessions for a deck
  async getStudySessionsByDeck(deckId: UniqueId): Promise<StudySession[]> {
    // Simulate API call
    await this.delay(500)

    return this.studySessions.filter(session => session.deckId === deckId)
  }

  // Get statistics for a user
  async getStudyStatsByUser(userId: UniqueId): Promise<StudyStats> {
    // Simulate API call
    await this.delay(600)

    const userSessions = this.studySessions.filter(session => session.userId === userId)

    // Calculate statistics
    const totalCards = userSessions.reduce((sum, session) => sum + session.cardsStudied, 0)
    const correctCards = userSessions.reduce((sum, session) => sum + session.cardsCorrect, 0)

    // Calculate study time in minutes
    const totalMinutes = userSessions.reduce((sum, session) => {
      if (!session.ended)
        return sum

      const startTime = new Date(session.started).getTime()
      const endTime = new Date(session.ended).getTime()
      const durationMinutes = (endTime - startTime) / (1000 * 60)

      return sum + durationMinutes
    }, 0)

    // Mock data for the rest
    return {
      totalCards,
      newCards: Math.floor(totalCards * 0.3),
      learningCards: Math.floor(totalCards * 0.2),
      reviewCards: Math.floor(totalCards * 0.5),
      averageCorrectRate: totalCards > 0 ? correctCards / totalCards : 0,
      streakDays: Math.floor(Math.random() * 10),
      totalTimeStudied: Math.round(totalMinutes),
    }
  }

  // Delete study sessions for a deck
  async deleteStudySessionsByDeck(deckId: UniqueId): Promise<boolean> {
    // Simulate API call
    await this.delay(700)

    const initialLength = this.studySessions.length
    this.studySessions = this.studySessions.filter(session => session.deckId !== deckId)

    return this.studySessions.length < initialLength
  }

  // Helper to simulate network delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

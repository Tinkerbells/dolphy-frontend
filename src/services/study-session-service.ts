// src/services/study-session-service.ts

import { inject, injectable } from 'inversify'

import type { CreateStudySessionDTO, StudySession, StudyStats } from '../models/study'
import type { StudySessionRepository } from '../repositories/study-session-repository'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class StudySessionService {
  constructor(
    @inject(SYMBOLS.StudySessionRepository) private studySessionRepository: StudySessionRepository,
  ) {}

  async createStudySession(userId: string, deckId: string): Promise<StudySession> {
    const sessionData: CreateStudySessionDTO = {
      userId,
      deckId,
    }

    return this.studySessionRepository.createStudySession(sessionData)
  }

  async updateStudySession(sessionId: string, data: {
    cardsStudied?: number
    cardsCorrect?: number
  }): Promise<StudySession | undefined> {
    return this.studySessionRepository.updateStudySession(sessionId, data)
  }

  async endStudySession(sessionId: string): Promise<StudySession | undefined> {
    return this.studySessionRepository.endStudySession(sessionId)
  }

  async getStudySessionsByUser(userId: string): Promise<StudySession[]> {
    return this.studySessionRepository.getStudySessionsByUser(userId)
  }

  async getStudySessionsByDeck(deckId: string): Promise<StudySession[]> {
    return this.studySessionRepository.getStudySessionsByDeck(deckId)
  }

  async getStudyStatsByUser(userId: string): Promise<StudyStats> {
    return this.studySessionRepository.getStudyStatsByUser(userId)
  }

  async deleteStudySessionsByDeck(deckId: string): Promise<boolean> {
    return this.studySessionRepository.deleteStudySessionsByDeck(deckId)
  }
}

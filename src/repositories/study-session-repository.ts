import { inject, injectable } from 'inversify'

import type { StudySession } from '../domain/study'
import type { StorageAdapter } from './storage-adapter'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class StudySessionRepository {
  constructor(
    @inject(SYMBOLS.StorageAdapter) private storage: StorageAdapter,
  ) {}

  async getAll(): Promise<StudySession[]> {
    return this.storage.getSessions()
  }

  async getById(id: string): Promise<StudySession | undefined> {
    const sessions = await this.storage.getSessions()
    return sessions.find(session => session.id === id)
  }

  async getByDeck(deckId: string): Promise<StudySession[]> {
    const sessions = await this.storage.getSessions()
    return sessions.filter(session => session.deckId === deckId)
  }

  async create(session: StudySession): Promise<void> {
    const sessions = await this.storage.getSessions()
    sessions.push(session)
    await this.storage.setSessions(sessions)
  }

  async update(session: StudySession): Promise<void> {
    const sessions = await this.storage.getSessions()
    const index = sessions.findIndex(s => s.id === session.id)
    if (index !== -1) {
      sessions[index] = session
      await this.storage.setSessions(sessions)
    }
  }

  async delete(id: string): Promise<void> {
    const sessions = await this.storage.getSessions()
    const filteredSessions = sessions.filter(session => session.id !== id)
    await this.storage.setSessions(filteredSessions)
  }
}

// src/controllers/study-session-store.ts

import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversify'

import type { CardDto } from '../models/cards'
import type { CardService } from '../services/card-service'
import type { DeckService } from '../services/deck-service'
import type { TelegramService } from '../services/telegram-service'
import type { StudySession, StudyStats } from '../models/study-session'
import type { NotificationService } from '../services/notification-service'
import type { StudySessionService } from '../services/study-session-service'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class StudySessionStore {
  isLoading = false
  currentSession: StudySession | null = null
  currentDeckId: string | null = null
  studyCards: CardDto[] = []
  currentCardIndex = 0
  userStats: StudyStats | null = null

  constructor(
    @inject(SYMBOLS.CardService) private cardService: CardService,
    @inject(SYMBOLS.DeckService) private deckService: DeckService,
    @inject(SYMBOLS.TelegramService) private telegramService: TelegramService,
    @inject(SYMBOLS.StudySessionService) private studySessionService: StudySessionService,
    @inject(SYMBOLS.NotificationService) private notificationService: NotificationService,
  ) {
    makeAutoObservable(this)
  }

  // Utility methods
  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading
  }

  setCurrentSession(session: StudySession | null): void {
    this.currentSession = session
  }

  setCurrentDeckId(deckId: string | null): void {
    this.currentDeckId = deckId
  }

  // Computed properties
  get currentCard(): CardDto | null {
    if (!this.studyCards.length || this.currentCardIndex >= this.studyCards.length) {
      return null
    }
    return this.studyCards[this.currentCardIndex]
  }

  get isSessionActive(): boolean {
    return this.currentSession !== null && !this.currentSession.ended
  }

  get sessionProgress(): number {
    if (!this.isSessionActive || !this.studyCards.length) {
      return 0
    }

    return Math.min(100, (this.currentCardIndex / this.studyCards.length) * 100)
  }

  get remainingCards(): number {
    if (!this.studyCards.length) {
      return 0
    }

    return this.studyCards.length - this.currentCardIndex
  }

  // Actions
  async startStudySession(deckId: string, limit?: number): Promise<boolean> {
    try {
      this.setLoading(true)

      // Загружаем карточки для изучения
      const dueCards = await this.cardService.getDueCards(deckId, limit)

      if (!dueCards.length) {
        this.notificationService.notify('No cards due for review')
        return false
      }

      // Создаем новую сессию
      const userId = this.telegramService.getUserId()
      const session = await this.studySessionService.createStudySession(userId, deckId)

      // Устанавливаем состояние
      this.setCurrentSession(session)
      this.setCurrentDeckId(deckId)
      this.studyCards = dueCards
      this.currentCardIndex = 0

      // Обновляем время последнего изучения колоды
      await this.deckService.updateLastStudied(deckId)

      return true
    }
    catch (error) {
      console.error('Failed to start study session:', error)
      this.notificationService.notify('Failed to start study session')
      return false
    }
    finally {
      this.setLoading(false)
    }
  }

  async endStudySession(): Promise<boolean> {
    if (!this.currentSession) {
      return false
    }

    try {
      this.setLoading(true)

      await this.studySessionService.endStudySession(this.currentSession.id)

      // Обновляем статистику колоды
      if (this.currentDeckId) {
        await this.deckService.refreshDeckCounts(this.currentDeckId)
      }

      // Очищаем состояние
      this.setCurrentSession(null)
      this.studyCards = []
      this.currentCardIndex = 0

      return true
    }
    catch (error) {
      console.error('Failed to end study session:', error)
      this.notificationService.notify('Failed to end study session')
      return false
    }
    finally {
      this.setLoading(false)
    }
  }

  async answerCard(answer: 'again' | 'hard' | 'good' | 'easy'): Promise<boolean> {
    if (!this.currentSession || !this.currentCard) {
      return false
    }

    try {
      this.setLoading(true)

      // Записываем результат ответа
      await this.cardService.recordCardReview(this.currentCard.id, answer)

      // Обновляем статистику сессии
      const wasCorrect = answer === 'good' || answer === 'easy'
      const sessionUpdate = {
        cardsStudied: this.currentSession.cardsStudied + 1,
        cardsCorrect: this.currentSession.cardsCorrect + (wasCorrect ? 1 : 0),
      }

      const updatedSession = await this.studySessionService.updateStudySession(
        this.currentSession.id,
        sessionUpdate,
      )

      if (updatedSession) {
        this.setCurrentSession(updatedSession)
      }

      // Переходим к следующей карточке
      this.currentCardIndex += 1

      // Если карточки закончились, завершаем сессию
      if (this.currentCardIndex >= this.studyCards.length) {
        await this.endStudySession()
      }

      return true
    }
    catch (error) {
      console.error('Failed to answer card:', error)
      this.notificationService.notify('Failed to save answer')
      return false
    }
    finally {
      this.setLoading(false)
    }
  }

  async loadUserStats(): Promise<StudyStats | null> {
    try {
      this.setLoading(true)

      const userId = this.telegramService.getUserId()
      const stats = await this.studySessionService.getStudyStatsByUser(userId)

      this.userStats = stats
      return stats
    }
    catch (error) {
      console.error('Failed to load user stats:', error)
      this.notificationService.notify('Failed to load statistics')
      return null
    }
    finally {
      this.setLoading(false)
    }
  }
}

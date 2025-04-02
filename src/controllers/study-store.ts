import { inject, injectable } from 'inversify'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'

import type { DeckStore } from './deck-store'
import type { StudyService } from '../services/study-service'
import type { TelegramService } from '../services/telegram-service'
import type { DueCard, StudySession, StudyStats } from '../domain/study'
import type { NotificationService } from '../services/notification-service'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class StudyStore {
  @observable currentSession?: StudySession
  @observable dueCards: DueCard[] = []
  @observable currentCardIndex = 0
  @observable isLoading = false
  @observable error?: string
  @observable isCardFlipped = false
  @observable studyStats?: StudyStats
  @observable currentDeckId?: string

  constructor(
    @inject(SYMBOLS.StudyService) private studyService: StudyService,
    @inject(SYMBOLS.TelegramService) private telegramService: TelegramService,
    @inject(SYMBOLS.NotificationService) private notifier: NotificationService,
    @inject(SYMBOLS.DeckStore) private deckStore: DeckStore,
  ) {
    makeObservable(this)
  }

  @computed get currentCard(): DueCard | undefined {
    if (this.dueCards.length === 0 || this.currentCardIndex >= this.dueCards.length) {
      return undefined
    }
    return this.dueCards[this.currentCardIndex]
  }

  @computed get hasMoreCards(): boolean {
    return this.currentCardIndex < this.dueCards.length - 1
  }

  @computed get progress(): number {
    if (this.dueCards.length === 0)
      return 0
    return (this.currentCardIndex / this.dueCards.length) * 100
  }

  @computed get isStudyCompleted(): boolean {
    return this.dueCards.length > 0 && this.currentCardIndex >= this.dueCards.length
  }

  @action async startStudySession(deckId: string) {
    this.isLoading = true
    this.error = undefined
    this.currentDeckId = deckId
    this.dueCards = []
    this.currentCardIndex = 0
    this.isCardFlipped = false

    try {
      // Load the due cards first
      const cards = await this.studyService.getDueCardsForStudy(deckId)

      if (cards.length === 0) {
        runInAction(() => {
          this.isLoading = false
          this.notifier.notify('No cards due for review!')
        })
        return false
      }

      // Then start the session
      const userId = this.telegramService.getUserId()
      const session = await this.studyService.startStudySession(userId, deckId)

      runInAction(() => {
        this.currentSession = session
        this.dueCards = cards
        this.isLoading = false
      })

      return true
    }
    catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to start study session'
        this.isLoading = false
        this.notifier.notify(this.error)
      })
      return false
    }
  }

  @action flipCard() {
    this.isCardFlipped = !this.isCardFlipped
  }

  @action async answerCard(performance: DifficultyLevel) {
    if (!this.currentCard || !this.currentSession)
      return

    this.isLoading = true

    try {
      // Process the card review
      await this.studyService.processCardReview(
        this.currentSession.id,
        {
          id: this.currentCard.id,
          performance,
        },
        performance >= 3, // Consider performance >= 3 as correct
      )

      runInAction(() => {
        // Move to the next card
        this.currentCardIndex++
        this.isCardFlipped = false
        this.isLoading = false

        // If we've reached the end, end the session
        if (this.isStudyCompleted && this.currentSession) {
          this.endSession()
        }
      })
    }
    catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to process answer'
        this.isLoading = false
        this.notifier.notify(this.error)
      })
    }
  }

  @action async endSession() {
    if (!this.currentSession)
      return

    this.isLoading = true

    try {
      await this.studyService.endStudySession(this.currentSession.id)

      runInAction(() => {
        // Update the deck to refresh card counts
        if (this.currentDeckId) {
          this.deckStore.loadDecks()
        }

        this.isLoading = false
        this.notifier.notify('Study session completed!')
      })
    }
    catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to end study session'
        this.isLoading = false
        this.notifier.notify(this.error)
      })
    }
  }

  @action async loadStudyStats() {
    this.isLoading = true
    this.error = undefined

    try {
      const userId = this.telegramService.getUserId()
      const stats = await this.studyService.getUserStats(userId)

      runInAction(() => {
        this.studyStats = stats
        this.isLoading = false
      })
    }
    catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to load study statistics'
        this.isLoading = false
        this.notifier.notify(this.error)
      })
    }
  }

  @action resetSession() {
    this.currentSession = undefined
    this.dueCards = []
    this.currentCardIndex = 0
    this.isCardFlipped = false
    this.currentDeckId = undefined
  }
}

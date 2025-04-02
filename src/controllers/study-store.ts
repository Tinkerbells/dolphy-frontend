import { inject, injectable } from 'inversify'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'

import type { Card } from '../domain/card'
import type { StudyService } from '../services/study-service'
import type { ReviewType, StudySession } from '../domain/study'
import type { NotificationService } from '../services/notification-service'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class StudyStore {
  @observable currentSession?: StudySession
  @observable studyCards: Card[] = []
  @observable currentCardIndex = 0
  @observable showAnswer = false
  @observable isLoading = false
  @observable error?: string

  constructor(
    @inject(SYMBOLS.StudyService) private studyService: StudyService,
    @inject(SYMBOLS.NotificationService) private notifier: NotificationService,
  ) {
    makeObservable(this)
  }

  @computed
  get currentCard(): Card | undefined {
    return this.studyCards[this.currentCardIndex]
  }

  @computed
  get progress(): number {
    if (this.studyCards.length === 0)
      return 0
    return (this.currentCardIndex / this.studyCards.length) * 100
  }

  @action
  async startStudySession(deckId: string) {
    this.isLoading = true
    this.error = undefined

    try {
      const result = await this.studyService.startSession(deckId)
      runInAction(() => {
        this.currentSession = result.session
        this.studyCards = result.cards
        this.currentCardIndex = 0
        this.showAnswer = false
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

  @action
  revealAnswer() {
    this.showAnswer = true
  }

  @action
  async answerCard(reviewType: ReviewType) {
    if (!this.currentSession || !this.currentCard) {
      this.notifier.notify('No active study session')
      return
    }

    try {
      await this.studyService.reviewCard(
        this.currentSession.id,
        this.currentCard.id,
        reviewType,
      )

      runInAction(() => {
        // Move to next card or end session
        if (this.currentCardIndex < this.studyCards.length - 1) {
          this.currentCardIndex++
          this.showAnswer = false
        }
        else {
          this.endStudySession()
        }
      })
    }
    catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to record answer'
      this.notifier.notify(this.error)
    }
  }

  @action
  async endStudySession() {
    if (!this.currentSession) {
      return
    }

    try {
      await this.studyService.endSession(this.currentSession.id)
      runInAction(() => {
        this.notifier.notify('Study session completed!')
        this.currentSession = undefined
        this.studyCards = []
        this.currentCardIndex = 0
        this.showAnswer = false
      })
    }
    catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to end session'
      this.notifier.notify(this.error)
    }
  }
}

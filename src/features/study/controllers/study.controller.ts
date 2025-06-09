import type { Mutation, Query } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'

import type { NetError } from '@/common/services/http-client'
import type { CacheService, Notify, RouterService } from '@/common'

import { root } from '@/app/navigation/routes'
import { cacheInstance, notify, router } from '@/common'

import type {
  Deck,
  FsrsCardWithContent,
  FsrsRepository,
  GradeCardDto,
  UndoGradeCardDto,
} from '../external'

import {
  fsrsService,
  Rating,
} from '../external'

export class StudyController {
  private readonly keys = {
    dueCards: (deckId: string) => ['study', deckId] as const,
  }

  private _deckId: Deck['id']
  private _sessionStats = {
    total: 0,
    correct: 0,
    incorrect: 0,
  }

  private _currentCardIndex = 0
  private _isProcessingSwipe = false
  private _isRefetching = false

  private _undoStack: Array<{
    cardId: string
    rating: Rating
    cardIndex: number
    sessionStats: {
      total: number
      correct: number
      incorrect: number
    }
  }> = []

  private _redoStack: Array<{
    cardId: string
    rating: Rating
    cardIndex: number
    sessionStats: {
      total: number
      correct: number
      incorrect: number
    }
  }> = []

  private readonly dueCardsQuery: Query<FsrsCardWithContent[], NetError>
  private readonly gradeCardMutation: Mutation<FsrsCardWithContent, GradeCardDto, NetError>
  private readonly undoGradeCardMutation: Mutation<FsrsCardWithContent, UndoGradeCardDto, NetError>

  constructor(
    private readonly cache: CacheService,
    private readonly router: RouterService,
    private readonly notify: Notify,
    private readonly fsrsService: FsrsRepository,
    deckId: Deck['id'],
  ) {
    this._deckId = deckId
    makeAutoObservable(this, {}, { autoBind: true })

    this.dueCardsQuery = this.cache.createQuery<FsrsCardWithContent[], NetError>(
      () => {
        if (!this._deckId) {
          throw new Error('Идентификатор колоды не установлен')
        }
        return this.fsrsService.findDueByDeckId(this._deckId)
      },
      {
        queryKey: this.keys.dueCards(this._deckId!),
        enabled: ({ queryKey }) => typeof queryKey[1] === 'string',
        enableOnDemand: true,
      },
    )

    this.gradeCardMutation = this.cache.createMutation<FsrsCardWithContent, GradeCardDto, NetError>(
      (dto: GradeCardDto) => this.fsrsService.grade(dto),
      {
        onSuccess: () => {
          // Обновляем данные каждые несколько оценок для производительности
          if (this._sessionStats.total % 3 === 0) {
            this._refetchDueCards()
          }
        },
        onError: (error) => {
          console.error('Grade card error:', error)
          this.notify.error('Ошибка при оценке карточки')
        },
      },
    )

    this.undoGradeCardMutation = this.cache.createMutation<FsrsCardWithContent, UndoGradeCardDto, NetError>(
      (dto: UndoGradeCardDto) => this.fsrsService.undoGrade(dto),
      {
        onSuccess: () => {
          this._refetchDueCards()
          this.notify.success('Оценка карточки отменена')
        },
        onError: (error) => {
          console.error('Undo grade card error:', error)
          this.notify.error('Ошибка при отмене оценки карточки')
        },
      },
    )
  }

  get dueCards(): FsrsCardWithContent[] | undefined {
    const cards = this.dueCardsQuery.result.data
    if (!cards)
      return undefined
    console.log('Due cards: ', cards.length)

    // Сортируем карточки по дате изучения (раньше = приоритет)
    return [...cards].sort((a, b) => {
      const dateA = new Date(a.due).getTime()
      const dateB = new Date(b.due).getTime()
      return dateA - dateB
    })
  }

  get isLoading(): boolean {
    return this.dueCardsQuery.result.isLoading
  }

  get isGrading(): boolean {
    return this.gradeCardMutation.result.isPending
  }

  get isRefetching(): boolean {
    return this._isRefetching
  }

  get currentCard(): FsrsCardWithContent | undefined {
    if (!this.dueCards || this.dueCards.length === 0) {
      return undefined
    }
    return this.dueCards[this._currentCardIndex]
  }

  get currentCardIndex(): number {
    return this._currentCardIndex
  }

  get isProcessingSwipe(): boolean {
    return this._isProcessingSwipe
  }

  get remainingCards(): number {
    if (!this.dueCards) {
      return 0
    }
    // Calculate remaining cards based on current position and available cards
    return Math.max(0, this.dueCards.length - this._currentCardIndex)
  }

  get sessionStats() {
    return { ...this._sessionStats }
  }

  get isSessionComplete(): boolean {
    return this.remainingCards === 0
  }

  get canUndo(): boolean {
    return this._undoStack.length > 0
  }

  get canRedo(): boolean {
    return this._redoStack.length > 0
  }

  get isUndoing(): boolean {
    return this.undoGradeCardMutation.result.isPending
  }

  async gradeCard(rating: Rating): Promise<void> {
    const currentCard = this.currentCard
    if (!currentCard || this._isProcessingSwipe) {
      return
    }

    this._isProcessingSwipe = true

    try {
      const gradeDto: GradeCardDto = {
        cardId: currentCard.cardId,
        rating,
      }

      // Save current state to undo stack before making changes
      this._undoStack.push({
        cardId: currentCard.cardId,
        rating,
        cardIndex: this._currentCardIndex,
        sessionStats: { ...this._sessionStats },
      })

      // Clear redo stack when new action is performed
      this._redoStack = []

      this._currentCardIndex++
      this._updateSessionStats(rating)

      this.gradeCardMutation.mutate(gradeDto).catch((error) => {
        // Rollback optimistic update
        this._undoStack.pop()
        this._currentCardIndex--
        this._revertSessionStats(rating)
        console.error('Grade card error (optimistic rollback):', error)
        this.notify.error('Ошибка при оценке карточки. Изменения отменены.')
      })

      if (this.isSessionComplete) {
        this._showSessionResults()
      }
    }
    finally {
      this._isProcessingSwipe = false
    }
  }

  finishSession(deckName?: Deck['name']) {
    return async () => {
      // Инвалидируем кэш для обновления статистики колоды
      await this.cache.getClient().invalidateQueries({
        queryKey: ['deck', this._deckId, 'due-cards'],
      })

      this.router.navigate(
        root.decks.detail.$buildPath({
          params: { id: this._deckId! },
        }),
        {
          state: root.decks.detail.$buildState({
            state: { deckName },
          }),
        },
      )
    }
  }

  undoLastGrade(): void {
    if (!this.canUndo || this.isUndoing) {
      return
    }

    const lastAction = this._undoStack.pop()
    if (!lastAction) {
      return
    }

    const undoDto: UndoGradeCardDto = {
      cardId: lastAction.cardId,
    }

    // Save current state for potential rollback
    const currentState = {
      cardIndex: this._currentCardIndex,
      sessionStats: { ...this._sessionStats },
    }

    // Move action to redo stack
    this._redoStack.push({
      cardId: lastAction.cardId,
      rating: lastAction.rating,
      cardIndex: this._currentCardIndex,
      sessionStats: { ...this._sessionStats },
    })

    // Restore previous state
    this._currentCardIndex = lastAction.cardIndex
    this._sessionStats = { ...lastAction.sessionStats }

    this.undoGradeCardMutation.mutate(undoDto).catch(() => {
      // Rollback if mutation fails
      this._undoStack.push(lastAction)
      this._redoStack.pop()
      this._currentCardIndex = currentState.cardIndex
      this._sessionStats = { ...currentState.sessionStats }
    })
  }

  redoLastGrade(): void {
    if (!this.canRedo || this.isGrading) {
      return
    }

    const redoAction = this._redoStack.pop()
    if (!redoAction) {
      return
    }

    const gradeDto: GradeCardDto = {
      cardId: redoAction.cardId,
      rating: redoAction.rating,
    }

    // Save current state for potential rollback
    const currentState = {
      cardIndex: this._currentCardIndex,
      sessionStats: { ...this._sessionStats },
    }

    // Move action back to undo stack
    this._undoStack.push({
      cardId: redoAction.cardId,
      rating: redoAction.rating,
      cardIndex: this._currentCardIndex,
      sessionStats: { ...this._sessionStats },
    })

    // Apply the redo action
    this._currentCardIndex = redoAction.cardIndex
    this._sessionStats = { ...redoAction.sessionStats }

    this.gradeCardMutation.mutate(gradeDto).catch(() => {
      // Rollback if mutation fails
      this._redoStack.push(redoAction)
      this._undoStack.pop()
      this._currentCardIndex = currentState.cardIndex
      this._sessionStats = { ...currentState.sessionStats }
    })
  }

  resetSessionStats(): void {
    this._sessionStats = {
      total: 0,
      correct: 0,
      incorrect: 0,
    }
    this._currentCardIndex = 0
    this._undoStack = []
    this._redoStack = []
  }

  async refreshDueCards(): Promise<void> {
    await this._refetchDueCards()
  }

  private _updateSessionStats(rating: Rating): void {
    this._sessionStats.total++
    if (rating === Rating.Good || rating === Rating.Easy) {
      this._sessionStats.correct++
    }
    else {
      this._sessionStats.incorrect++
    }
  }

  private _revertSessionStats(rating: Rating): void {
    this._sessionStats.total--
    if (rating === Rating.Good || rating === Rating.Easy) {
      this._sessionStats.correct--
    }
    else {
      this._sessionStats.incorrect--
    }
  }

  private async _refetchDueCards(): Promise<void> {
    this._isRefetching = true
    try {
      await this.dueCardsQuery.refetch()
      // Reset current card index since the array has changed
      this._currentCardIndex = 0
    }
    finally {
      this._isRefetching = false
    }
  }

  private _showSessionResults(): void {
    const { total, correct } = this._sessionStats
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

    this.notify.success(
      `Сессия завершена! Точность: ${accuracy}% (${correct}/${total})`,
    )
  }
}

export function createStudyController(deckId: Deck['id']) {
  return () => new StudyController(
    cacheInstance,
    router,
    notify,
    fsrsService,
    deckId,
  )
}

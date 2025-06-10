import type { Mutation, Query } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'

import type { NetError } from '@/common/services/http-client'
import type {
  CacheService,
  Notify,
  RouterService,
  SwipeDirection,
  SwipeType,
} from '@/common'

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

interface SessionStats {
  total: number
  correct: number
  incorrect: number
}

type HistoryAction = Array<{
  cardId: string
  rating: Rating
  sessionStats: SessionStats
}>

export class StudyController {
  // Ключи для кеширования запросов
  private readonly keys = {
    dueCards: (deckId: string) => ['study', deckId] as const,
  }

  private _deckId: Deck['id']

  private _sessionStats: SessionStats = { total: 0, correct: 0, incorrect: 0 }

  private readonly swipeDirectionToRating = {
    left: Rating.Again,
    down: Rating.Hard,
    right: Rating.Good,
    up: Rating.Easy,
  } as const

  private _currentCardIndex = 0
  private _isProcessingSwipe = false
  private _isRefetching = false
  private _localDueCards: FsrsCardWithContent[] = []

  private _undoStack: HistoryAction = []

  private _redoStack: HistoryAction = []

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
      () => this.fsrsService.findDueByDeckId(this._deckId),
      {
        queryKey: this.keys.dueCards(this._deckId),
        enabled: ({ queryKey }) => typeof queryKey[1] === 'string',
        enableOnDemand: true,
      },
    )

    this.gradeCardMutation = this.cache.createMutation<FsrsCardWithContent, GradeCardDto, NetError>(
      (dto: GradeCardDto) => this.fsrsService.grade(dto),
      { onError: () => this.notify.error('Ошибка при оценке карточки') },
    )

    this.undoGradeCardMutation = this.cache.createMutation<FsrsCardWithContent, UndoGradeCardDto, NetError>(
      (dto: UndoGradeCardDto) => this.fsrsService.undoGrade(dto),
      {
        onSuccess: () => this.notify.success('Оценка карточки отменена'),
        onError: () => this.notify.error('Ошибка при отмене оценки карточки'),
      },
    )
  }

  get dueCards(): FsrsCardWithContent[] | undefined {
    const serverCards = this.dueCardsQuery.result.data

    if (serverCards && this._localDueCards.length === 0) {
      this._localDueCards = serverCards
        .slice()
        .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
    }

    return this._localDueCards
  }

  get isLoading(): boolean { return this.dueCardsQuery.result.isLoading }
  get isGrading(): boolean { return this.gradeCardMutation.result.isPending }
  get isRefetching(): boolean { return this._isRefetching }

  get currentCard(): FsrsCardWithContent | undefined {
    return this.dueCards?.[0]
  }

  get isProcessingSwipe(): boolean {
    return this._isProcessingSwipe
  }

  get remainingCards(): number {
    return this.dueCards?.length ?? 0
  }

  get sessionStats() {
    return { ...this._sessionStats }
  }

  get isSessionComplete(): boolean { return this.remainingCards === 0 }
  get canUndo(): boolean { return this._undoStack.length > 0 }
  get canRedo(): boolean { return this._redoStack.length > 0 }
  get isUndoing(): boolean { return this.undoGradeCardMutation.result.isPending }

  get progress(): number {
    if (!this.dueCards?.length)
      return 100
    const totalCards = this._sessionStats.total + this.dueCards.length
    return totalCards > 0 ? Math.round((this._sessionStats.total / totalCards) * 100) : 0
  }

  handleSwipe = (swipeData: SwipeType): void => {
    const rating = this.swipeDirectionToRating[swipeData.direction as SwipeDirection]
    if (rating !== undefined)
      this.gradeCard(rating)
  }

  // Оценка карточки с указанным рейтингом
  async gradeCard(rating: Rating): Promise<void> {
    const currentCard = this.currentCard

    if (!currentCard || this._isProcessingSwipe || !this._localDueCards) {
      return
    }

    this._isProcessingSwipe = true

    try {
      const gradeDto: GradeCardDto = {
        cardId: currentCard.cardId,
        rating,
      }

      this._undoStack.push({
        cardId: currentCard.cardId,
        rating,
        sessionStats: { ...this._sessionStats },
      })

      this._redoStack = []
      this._localDueCards = this._localDueCards.slice(1)
      this._updateSessionStats(rating)

      this.gradeCardMutation.mutate(gradeDto).catch(() => {
        const lastAction = this._undoStack.pop()
        if (lastAction) {
          this._localDueCards = [currentCard, ...this._localDueCards]
          this._revertSessionStats(rating)
        }
        this.notify.error('Ошибка при оценке карточки. Изменения отменены.')
      })

      if (this.isSessionComplete)
        this._showSessionResults()
    }
    finally {
      this._isProcessingSwipe = false
    }
  }

  finishSession(deckName?: Deck['name']) {
    return async () => {
      await this.cache.getClient().invalidateQueries({
        queryKey: ['deck', this._deckId, 'due-cards'],
      })

      this.router.navigate(
        root.decks.detail.$buildPath({ params: { id: this._deckId } }),
        { state: root.decks.detail.$buildState({ state: { deckName } }) },
      )
    }
  }

  undoLastGrade(): void {
    if (!this.canUndo || this.isUndoing || !this._localDueCards)
      return

    const lastAction = this._undoStack.pop()
    if (!lastAction)
      return

    const currentState = {
      sessionStats: { ...this._sessionStats },
      localCards: [...this._localDueCards],
    }

    this._redoStack.push({
      cardId: lastAction.cardId,
      rating: lastAction.rating,
      sessionStats: { ...this._sessionStats },
    })

    const cardToRestore = this.dueCardsQuery.result.data?.find(card => card.cardId === lastAction.cardId)
    if (cardToRestore) {
      this._localDueCards = [cardToRestore, ...this._localDueCards]
    }

    this._sessionStats = { ...lastAction.sessionStats }

    this.undoGradeCardMutation.mutate({ cardId: lastAction.cardId }).catch(() => {
      this._undoStack.push(lastAction)
      this._redoStack.pop()
      this._sessionStats = { ...currentState.sessionStats }
      this._localDueCards = [...currentState.localCards]
    })
  }

  redoLastGrade(): void {
    if (!this.canRedo || this.isGrading || !this._localDueCards)
      return

    const redoAction = this._redoStack.pop()
    if (!redoAction)
      return

    const currentState = {
      sessionStats: { ...this._sessionStats },
      localCards: [...this._localDueCards],
    }

    this._undoStack.push({
      cardId: redoAction.cardId,
      rating: redoAction.rating,
      sessionStats: { ...this._sessionStats },
    })

    this._localDueCards = this._localDueCards.slice(1)
    this._sessionStats = { ...redoAction.sessionStats }

    this.gradeCardMutation.mutate({
      cardId: redoAction.cardId,
      rating: redoAction.rating,
    }).catch(() => {
      this._redoStack.push(redoAction)
      this._undoStack.pop()
      this._sessionStats = { ...currentState.sessionStats }
      this._localDueCards = [...currentState.localCards]
    })
  }

  async refreshDueCards(): Promise<void> {
    this._isRefetching = true
    try {
      await this.dueCardsQuery.refetch()
      this._localDueCards = []
      this._currentCardIndex = 0
    }
    finally {
      this._isRefetching = false
    }
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

  private _showSessionResults(): void {
    const { total, correct } = this._sessionStats
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
    this.notify.success(`Сессия завершена! Точность: ${accuracy}% (${correct}/${total})`)
  }
}

export function createStudyController(deckId: Deck['id']) {
  return () => new StudyController(cacheInstance, router, notify, fsrsService, deckId)
}

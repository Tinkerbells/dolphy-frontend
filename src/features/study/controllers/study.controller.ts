import type { MobxMutation, MobxQuery } from 'mobx-tanstack-query'

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
} from '../external'

import {
  fsrsService,
  Rating,
} from '../external'

export class StudyController {
  private readonly keys = {
    deckCards: ['deck', 'cards'] as const,
    deckDueCards: (id: string) => ['deck', id, 'due-cards'] as const,
    dueCards: (deckId: string) => ['study', deckId] as const,
  }

  private _deckId: Deck['id']
  private _currentCardIndex = 0
  private _isCardFlipped = false
  private _gradedCardsCount = 0
  private _sessionStats = {
    total: 0,
    correct: 0,
    incorrect: 0,
  }

  private readonly dueCardsQuery: MobxQuery<FsrsCardWithContent[], NetError>
  private readonly gradeCardMutation: MobxMutation<FsrsCardWithContent, GradeCardDto, NetError>

  constructor(
    private readonly cache: CacheService,
    private readonly router: RouterService,
    private readonly notify: Notify,
    private readonly fsrsService: FsrsRepository,
    deckId: Deck['id'],
  ) {
    this._deckId = deckId
    makeAutoObservable(this, {}, { autoBind: true })

    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-ignore
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
        onSuccess: (_, variables) => {
          // TODO: добавить i18n в notify
          this._updateSessionStats(variables.rating)
          this._moveToNextCard()
          this._gradedCardsCount++
          if (this._gradedCardsCount % 3 === 0) {
            this._refetchDueCards()
          }
          if (this.isSessionComplete) {
            this._showSessionResults()
          }
          // this.notify.success('Карточка успешно оценена')
        },
        onError: (error) => {
          // this.notify.error('Ошибка при оценке карточки')
          console.error('Grade card error:', error)
        },
      },
    )
  }

  get dueCards(): FsrsCardWithContent[] | undefined {
    return this.dueCardsQuery.result.data
  }

  get isLoading(): boolean {
    return this.dueCardsQuery.result.isLoading
  }

  get isGrading(): boolean {
    return this.gradeCardMutation.result.isPending
  }

  get currentCard(): FsrsCardWithContent | undefined {
    if (!this.dueCards || this.dueCards.length === 0) {
      return undefined
    }
    return this.dueCards[this._currentCardIndex]
  }

  get isCardFlipped(): boolean {
    return this._isCardFlipped
  }

  get progress(): number {
    if (!this.dueCards || this.dueCards.length === 0) {
      return 100
    }
    return Math.round((this._currentCardIndex / this.dueCards.length) * 100)
  }

  get remainingCards(): number {
    if (!this.dueCards) {
      return 0
    }
    return this.dueCards.length - this._currentCardIndex
  }

  get sessionStats() {
    return { ...this._sessionStats }
  }

  get isSessionComplete(): boolean {
    return this.remainingCards === 0
  }

  flipCard(): void {
    this._isCardFlipped = !this._isCardFlipped
  }

  async gradeCard(rating: Rating): Promise<void> {
    const currentCard = this.currentCard
    if (!currentCard) {
      return
    }

    const gradeDto: GradeCardDto = {
      cardId: currentCard.cardId,
      rating,
    }

    await this.gradeCardMutation.mutate(gradeDto)
  }

  finishSession(deckName?: Deck['name']) {
    return async () => {
      await this.cache.getClient().invalidateQueries({ queryKey: this.keys.deckDueCards(this._deckId) })
      this.router.navigate(
        root.decks.detail.$buildPath({
          params: { id: this._deckId! },
        }),
        { state: root.decks.detail.$buildState({
          state: { deckName },
        }) },
      )
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

  private _moveToNextCard(): void {
    this._currentCardIndex++
    this._isCardFlipped = false
  }

  private async _refetchDueCards(): Promise<void> {
    await this.dueCardsQuery.refetch()
  }

  private _showSessionResults(): void {
    // const { total, correct } = this._sessionStats

    // this.notify.success(
    //   `Сессия завершена! Точность: ${accuracy}% (${correct}/${total})`,
    // )
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

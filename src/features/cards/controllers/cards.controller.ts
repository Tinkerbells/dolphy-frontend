import { makeAutoObservable } from 'mobx'

import type { NetError } from '@/common/services/http-client'
import type { CacheService, Notify, RouterService } from '@/common'

import { root } from '@/app/navigation/routes'
import { cacheInstance, notify, router } from '@/common'

import type { Deck } from '../external'
import type { Card } from '../../cards/models/card.domain'
import type { CardsRepository } from '../../cards/models/repositories/cards.repository'

import { cardsService } from '../../cards/services/cards.service'

export class CardsControllerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DeckDetailControllerError'
  }
}

/**
 * Контроллер для управления детальной страницей колоды
 */
export class DeckDetailController {
  private readonly keys = {
    deck: (id: string) => ['deck', id] as const,
    deckCards: (id: string) => ['deck', id, 'cards'] as const,
    deckDueCards: (id: string) => ['deck', id, 'due-cards'] as const,
  }

  private _deckId?: Deck['id'] = undefined

  /**
   * Создает экземпляр контроллера детальной страницы колоды
   */
  constructor(
    private readonly cache: CacheService,
    private readonly router: RouterService,
    private readonly notify: Notify,
    private readonly cardsService: CardsRepository,
    deckId: Deck['id'],
  ) {
    this._deckId = deckId
    makeAutoObservable(this, {}, { autoBind: true })
  }

  setDeckId(deckId: string): void {
    if (this._deckId !== deckId) {
      this._deckId = deckId
      this._refetchData()
    }
  }

  get deckId() {
    return this._deckId
  }

  get isCardsLoading(): boolean {
    return this.deckCardsQuery.result.isLoading
  }

  get isDueCardsLoading(): boolean {
    return this.deckDueCardsQuery.result.isLoading
  }

  get cards(): Card[] | undefined {
    return this.deckCardsQuery.result.data
  }

  get dueCards(): Card[] | undefined {
    return this.deckDueCardsQuery.result.data
  }

  get totalCardsCount(): number {
    return this.cards?.length ?? 0
  }

  get dueCardsCount(): number {
    return this.dueCards?.length ?? 0
  }

  get newCardsCount(): number {
    return this.cards?.filter(cardWithContent =>
      cardWithContent.state === 'New',
    ).length ?? 0
  }

  get learningCardsCount(): number {
    return this.cards?.filter(cardWithContent =>
      cardWithContent.state === 'Learning' || cardWithContent.state === 'Relearning',
    ).length ?? 0
  }

  /**
   * Переходит к странице обучения с текущей колодой
   */
  startStudy(): void {
    if (!this._deckId) {
      this.notify.error('Колода не выбрана')
      return
    }

    if (this.dueCardsCount === 0) {
      this.notify.info('Нет карточек для повторения')
      return
    }

    // Переход к странице обучения (нужно будет создать маршрут)
    this.router.navigate(`/decks/${this._deckId}/study`)
  }

  /**
   * Возвращается к списку колод
   */
  goBackToDecks(): void {
    this.router.navigate(root.decks.$path())
  }

  /**
   * Обновляет данные колоды и карточек
   */
  private _refetchData(): void {
    if (this._deckId) {
      this.deckCardsQuery.refetch()
      this.deckDueCardsQuery.refetch()
    }
  }

  /**
   * Запрос для получения всех карточек колоды
   */
  private readonly deckCardsQuery = this.cache.createQuery<Card[], NetError>(
    () => {
      if (!this._deckId) {
        throw new CardsControllerError('Идентификатор колоды не установлен')
      }
      return this.cardsService.findByDeckId(this._deckId)
    },
    {
      queryKey: this._deckId ? this.keys.deckCards(this._deckId) : [],
      enableOnDemand: true,
    },
  )

  /**
   * Запрос для получения карточек для повторения
   */
  private readonly deckDueCardsQuery = this.cache.createQuery<Card[], NetError>(
    () => {
      if (!this._deckId) {
        throw new CardsControllerError('Идентификатор колоды не установлен')
      }
      return this.cardsService.findDueByDeckId(this._deckId)
    },
    {
      queryKey: this._deckId ? this.keys.deckDueCards(this._deckId) : [],
      enabled: () => !!this._deckId,
    },
  )
}

export function createCardsController(deckId: Deck['id']) {
  return () => new DeckDetailController(
    cacheInstance,
    router,
    notify,
    cardsService,
    deckId,
  )
}

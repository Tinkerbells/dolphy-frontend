import type { MobxQuery } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'

import type { NetError } from '@/common/services/http-client'
import type { CacheService, Modal, Notify, RouterService } from '@/common'

import { root } from '@/app/navigation/routes'
import { cacheInstance, modalInstance, notify, router } from '@/common'

import type { Deck } from '../../decks/models/deck.domain'
import type { Card, CardsRepository, FsrsCardWithContent, FsrsRepository } from '../external'

import { cardsService, fsrsService, State } from '../external'

export interface CardsModals {
  create: () => void
  delete: (id: string) => void
}

/**
 * Контроллер для детальной страницы колоды с управлением карточками
 */
export class DeckDetailController {
  private readonly keys = {
    deckCards: (id: string) => ['deck', id, 'cards'] as const,
    deckDueCards: (id: string) => ['deck', id, 'due-cards'] as const,
  }

  private readonly deckCardsQuery: MobxQuery<Card[], NetError>
  private readonly deckDueCardsQuery: MobxQuery<FsrsCardWithContent[], NetError>

  private _deckId?: Deck['id'] = undefined
  private _openModal?: CardsModals

  constructor(
    private readonly cache: CacheService,
    private readonly modal: Modal,
    private readonly router: RouterService,
    private readonly notify: Notify,
    private readonly cardsService: CardsRepository,
    private readonly fsrsService: FsrsRepository,
    deckId: Deck['id'],
  ) {
    this._deckId = deckId
    // TODO: check newer version of `mobx-tanstack-query` for fixing this bug
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-ignore
    this.deckCardsQuery = this.cache.createQuery<Card[], NetError>(
      () => {
        if (!this._deckId) {
          throw new Error('Идентификатор колоды не установлен')
        }
        return this.cardsService.findByDeckId(this._deckId)
      },
      {
        queryKey: this.keys.deckCards(this._deckId!),
        enabled: ({ queryKey }) => typeof queryKey[1] === 'string',
        enableOnDemand: true,
      },
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-ignore
      this.deckDueCardsQuery = this.cache.createQuery<FsrsCardWithContent[], NetError>(
        () => {
          if (!this._deckId) {
            throw new Error('Идентификатор колоды не установлен')
          }
          return this.fsrsService.findDueByDeckId(this._deckId)
        },
        {
          queryKey: this.keys.deckDueCards(this._deckId!),
          refetchInterval: 0.5 * 60 * 1000, // 30 seconds
          enabled: ({ queryKey }) => typeof queryKey[1] === 'string',
          enableOnDemand: true,
        },
      ),
    )
    makeAutoObservable(this, {}, { autoBind: true })
  }

  setModalsHandlers(modalsHandler: CardsModals) {
    this._openModal = modalsHandler
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

  get cards() {
    return this.deckCardsQuery.result.data
  }

  get dueCards() {
    return this.deckDueCardsQuery.result.data
  }

  get totalCardsCount(): number {
    return this.cards?.length ?? 0
  }

  get dueCardsCount(): number {
    return this.dueCards?.length ?? 0
  }

  get newCardsCount(): number {
    return this.dueCards?.filter(cardWithContent =>
      cardWithContent.state === State.New,
    ).length ?? 0
  }

  get learningCardsCount(): number {
    return this.dueCards?.filter(cardWithContent =>
      cardWithContent.state === State.Learning || cardWithContent.state === State.Relearning,
    ).length ?? 0
  }

  get masteredCardsCount(): number {
    return this.dueCards?.filter(cardWithContent =>
      cardWithContent.state === State.Review,
    ).length ?? 0
  }

  openCreateModal() {
    this._openModal?.create()
  }

  openDeleteModal = (cardId: string) => {
    return () => this._openModal?.delete(cardId)
  }

  /**
   * Переходит к странице обучения с текущей колодой
   */
  startStudy(deckName?: Deck['name']) {
    return () => {
      if (!this._deckId) {
      // TODO: i18n
        this.notify.error('Колода не выбрана')
        return
      }

      if (this.dueCardsCount === 0) {
        this.notify.info('Нет карточек для повторения')
        return
      }

      // Переход к странице обучения
      this.router.navigate(
        root.decks.detail.study.$buildPath({
          params: { id: this._deckId },
        }),
        { state:
      root.decks.detail.study.$buildState({
        state: { deckName },
      }) },
      )
    }
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
}

export function createDeckDetailController(deckId: Deck['id']) {
  return () => new DeckDetailController(
    cacheInstance,
    modalInstance,
    router,
    notify,
    cardsService,
    fsrsService,
    deckId,
  )
}

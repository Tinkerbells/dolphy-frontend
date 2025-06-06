import type { MobxQuery } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'

import type { NetError } from '@/common/services/http-client'
import type { CacheService, Notify, RouterService } from '@/common'

import { root } from '@/app/navigation/routes'
import { cacheInstance, notify, router } from '@/common'

import type { Deck, FsrsCardWithContent, FsrsRepository } from '../external'

import { fsrsService, Rating } from '../external'

/**
 * Контроллер для управления страницей обучения
 */
export class StudyController {
  private readonly keys = {
    dueCards: (deckId: string) => ['study', 'due-cards', deckId] as const,
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
  }

  /**
   * Получить текущие карточки для повторения
   */
  get dueCards(): FsrsCardWithContent[] | undefined {
    return this.dueCardsQuery.result.data
  }

  /**
   * Проверить загружаются ли карточки
   */
  get isLoading(): boolean {
    return this.dueCardsQuery.result.isLoading
  }

  /**
   * Получить текущую карточку для изучения
   */
  get currentCard(): FsrsCardWithContent | undefined {
    if (!this.dueCards || this.dueCards.length === 0) {
      return undefined
    }
    return this.dueCards[this._currentCardIndex]
  }

  /**
   * Проверить перевернута ли карточка
   */
  get isCardFlipped(): boolean {
    return this._isCardFlipped
  }

  /**
   * Получить прогресс обучения (в процентах)
   */
  get progress(): number {
    if (!this.dueCards || this.dueCards.length === 0) {
      return 100
    }
    return Math.round((this._currentCardIndex / this.dueCards.length) * 100)
  }

  /**
   * Получить количество оставшихся карточек
   */
  get remainingCards(): number {
    if (!this.dueCards) {
      return 0
    }
    return this.dueCards.length - this._currentCardIndex
  }

  /**
   * Получить статистику сессии
   */
  get sessionStats() {
    return { ...this._sessionStats }
  }

  /**
   * Проверить завершена ли сессия
   */
  get isSessionComplete(): boolean {
    return this.remainingCards === 0
  }

  /**
   * Перевернуть карточку
   */
  flipCard(): void {
    this._isCardFlipped = !this._isCardFlipped
  }

  /**
   * Оценить карточку и перейти к следующей
   */
  async gradeCard(rating: Rating): Promise<void> {
    const currentCard = this.currentCard
    if (!currentCard) {
      return
    }

    try {
      // Отправляем оценку на сервер
      // В реальном проекте здесь должен быть вызов API для оценки карточки
      // await this.fsrsService.gradeCard(currentCard.cardId, rating)

      // Обновляем статистику
      this._sessionStats.total++
      if (rating === Rating.Good || rating === Rating.Easy) {
        this._sessionStats.correct++
      }
      else {
        this._sessionStats.incorrect++
      }

      // Переходим к следующей карточке
      this._moveToNextCard()

      // Обновляем данные каждые 3 оцененные карточки
      this._gradedCardsCount++
      if (this._gradedCardsCount % 3 === 0) {
        await this._refetchDueCards()
      }

      // Если карточки закончились, показываем результаты
      if (this.isSessionComplete) {
        this._showSessionResults()
      }
    }
    catch (error) {
      this.notify.error('Ошибка при оценке карточки')
      console.error('Grade card error:', error)
    }
  }

  /**
   * Завершить сессию обучения
   */
  finishSession(): void {
    // TODO: вернуть обратно на страницу с коллодой
    this.router.navigate(root.decks.$path())
  }

  /**
   * Перейти к следующей карточке
   */
  private _moveToNextCard(): void {
    this._currentCardIndex++
    this._isCardFlipped = false
  }

  /**
   * Обновить список карточек для повторения
   */
  private async _refetchDueCards(): Promise<void> {
    await this.dueCardsQuery.refetch()
  }

  /**
   * Показать результаты сессии
   */
  private _showSessionResults(): void {
    const { total, correct } = this._sessionStats
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

    this.notify.success(
      `Сессия завершена! Точность: ${accuracy}% (${correct}/${total})`,
    )
  }
}

/**
 * Фабрика для создания контроллера обучения
 */
export function createStudyController(deckId: Deck['id']) {
  return () => new StudyController(
    cacheInstance,
    router,
    notify,
    fsrsService,
    deckId,
  )
}

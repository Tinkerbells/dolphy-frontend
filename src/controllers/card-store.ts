// src/controllers/card-store.ts

import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversify'

import type { CardDto } from '../models/cards'
import type { CardService } from '../services/card-service'
import type { NotificationService } from '../services/notification-service'

import { SYMBOLS } from '../di/symbols'
import { Cards } from '../models/cards'

@injectable()
export class CardStore {
  cards: Cards = new Cards()
  currentCardId: string | null = null
  isLoading = false
  currentDeckId: string | null = null

  constructor(
    @inject(SYMBOLS.CardService) private cardService: CardService,
    @inject(SYMBOLS.NotificationService) private notificationService: NotificationService,
  ) {
    makeAutoObservable(this)
  }

  // Utility methods
  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading
  }

  setCurrentCardId(cardId: string | null): void {
    this.currentCardId = cardId
  }

  setCurrentDeckId(deckId: string | null): void {
    this.currentDeckId = deckId
  }

  // Computed getters
  get currentCard(): CardDto | undefined {
    if (!this.currentCardId)
      return undefined
    return this.cards.find(card => card.id === this.currentCardId)
  }

  get dueCards(): CardDto[] {
    const now = new Date().toISOString()
    return this.cards.filter(card =>
      card.status === 'new'
      || !card.dueDate
      || card.dueDate <= now,
    )
  }

  get newCards(): CardDto[] {
    return this.cards.cards.filter(card => card.status === 'new')
  }

  get learningCards(): CardDto[] {
    return this.cards.cards.filter(card =>
      card.status === 'learning'
      || card.status === 'relearning',
    )
  }

  get reviewCards(): CardDto[] {
    return this.cards.cards.filter(card => card.status === 'review')
  }

  async loadCards(deckId: string): Promise<void> {
    try {
      this.setLoading(true)
      this.setCurrentDeckId(deckId)
      this.cards = await this.cardService.getCardsByDeck(deckId)
    }
    catch (error) {
      console.error('Failed to load cards:', error)
      this.notificationService.notify('Failed to load cards')
    }
    finally {
      this.setLoading(false)
    }
  }

  async loadCard(cardId: string): Promise<CardDto | null> {
    try {
      this.setLoading(true)
      const card = await this.cardService.getCard(cardId)

      if (card) {
        this.setCurrentCardId(cardId)
      }

      return card
    }
    catch (error) {
      console.error('Failed to load card:', error)
      this.notificationService.notify('Failed to load card')
      return null
    }
    finally {
      this.setLoading(false)
    }
  }

  async createCard(deckId: string, front: string, back: string, tags: string[] = []): Promise<CardDto | null> {
    try {
      this.setLoading(true)
      const newCard = await this.cardService.createCard(deckId, front, back, tags)

      // Обновляем локальный список карточек, если текущая колода та же
      if (this.currentDeckId === deckId) {
        this.cards.push(newCard)
      }

      this.notificationService.notify('Card created successfully')
      return newCard
    }
    catch (error) {
      console.error('Failed to create card:', error)
      this.notificationService.notify('Failed to create card')
      return null
    }
    finally {
      this.setLoading(false)
    }
  }

  async updateCard(cardId: string, updates: { front?: string, back?: string, tags?: string[] }): Promise<boolean> {
    try {
      this.setLoading(true)
      const updatedCard = await this.cardService.updateCard(cardId, updates)

      if (updatedCard) {
        // Обновляем локальную карточку в массиве
        const index = this.cards.findIndex(card => card.id === cardId)
        if (index !== -1) {
          this.cards[index] = updatedCard
        }

        this.notificationService.notify('Card updated successfully')
        return true
      }
      return false
    }
    catch (error) {
      console.error('Failed to update card:', error)
      this.notificationService.notify('Failed to update card')
      return false
    }
    finally {
      this.setLoading(false)
    }
  }

  async deleteCard(cardId: string): Promise<boolean> {
    try {
      this.setLoading(true)
      const success = await this.cardService.deleteCard(cardId)

      if (success) {
        // Удаляем карточку из локального массива
        this.cards = this.cards.filter(card => card.id !== cardId)

        // Очищаем currentCardId, если удалена текущая карточка
        if (this.currentCardId === cardId) {
          this.setCurrentCardId(null)
        }

        this.notificationService.notify('Card deleted successfully')
      }

      return success
    }
    catch (error) {
      console.error('Failed to delete card:', error)
      this.notificationService.notify('Failed to delete card')
      return false
    }
    finally {
      this.setLoading(false)
    }
  }

  async reviewCard(
    cardId: string,
    answer: 'again' | 'hard' | 'good' | 'easy',
  ): Promise<CardDto | null> {
    try {
      this.setLoading(true)
      const updatedCard = await this.cardService.recordCardReview(cardId, answer)

      if (updatedCard) {
        // Обновляем локальную карточку в массиве
        const index = this.cards.findIndex(card => card.id === cardId)
        if (index !== -1) {
          this.cards[index] = updatedCard
        }
      }

      return updatedCard
    }
    catch (error) {
      console.error('Failed to record card review:', error)
      this.notificationService.notify('Failed to save review')
      return null
    }
    finally {
      this.setLoading(false)
    }
  }

  async resetCard(cardId: string): Promise<boolean> {
    try {
      this.setLoading(true)
      const updatedCard = await this.cardService.resetCard(cardId)

      if (updatedCard) {
        // Обновляем локальную карточку в массиве
        const index = this.cards.findIndex(card => card.id === cardId)
        if (index !== -1) {
          this.cards[index] = updatedCard
        }

        this.notificationService.notify('Card reset successfully')
        return true
      }

      return false
    }
    catch (error) {
      console.error('Failed to reset card:', error)
      this.notificationService.notify('Failed to reset card')
      return false
    }
    finally {
      this.setLoading(false)
    }
  }

  async bulkCreateCards(
    deckId: string,
    cards: Array<{ front: string, back: string, tags?: string[] }>,
  ): Promise<CardDto[]> {
    try {
      this.setLoading(true)
      const newCards = await this.cardService.bulkCreateCards(deckId, cards)

      // Обновляем локальный список карточек, если текущая колода та же
      if (this.currentDeckId === deckId) {
        this.cards.push(...newCards)
      }

      this.notificationService.notify(`${newCards.length} cards created successfully`)
      return newCards
    }
    catch (error) {
      console.error('Failed to create cards:', error)
      this.notificationService.notify('Failed to create cards')
      return []
    }
    finally {
      this.setLoading(false)
    }
  }
}

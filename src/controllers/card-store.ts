import { inject, injectable } from 'inversify'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'

import type { Card, CardFace } from '../domain/card'
import type { CardService } from '../services/card-service'
import type { NotificationService } from '../services/notification-service'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class CardStore {
  @observable cards: Card[] = []
  @observable selectedCard?: Card
  @observable isLoading = false
  @observable error?: string

  constructor(
    @inject(SYMBOLS.CardService) private cardService: CardService,
    @inject(SYMBOLS.NotificationService) private notifier: NotificationService,
  ) {
    makeObservable(this)
  }

  @computed
  get cardsByDeck() {
    return (deckId: string) => this.cards.filter(card => card.deckId === deckId)
  }

  @action
  async loadCardsByDeck(deckId: string) {
    this.isLoading = true
    this.error = undefined

    try {
      const cards = await this.cardService.getCardsByDeck(deckId)
      runInAction(() => {
        // Update existing cards and add new ones
        cards.forEach((card) => {
          const index = this.cards.findIndex(c => c.id === card.id)
          if (index !== -1) {
            this.cards[index] = card
          }
          else {
            this.cards.push(card)
          }
        })
        this.isLoading = false
      })
    }
    catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to load cards'
        this.isLoading = false
        this.notifier.notify(this.error)
      })
    }
  }

  @action
  async createCard(front: CardFace, back: CardFace, deckId: string, tags: string[] = []) {
    this.isLoading = true
    this.error = undefined

    try {
      const card = await this.cardService.createCard(front, back, deckId, tags)
      runInAction(() => {
        this.cards.push(card)
        this.isLoading = false
        this.notifier.notify('Card created successfully')
      })
      return card
    }
    catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to create card'
        this.isLoading = false
        this.notifier.notify(this.error)
      })
      return undefined
    }
  }

  @action
  selectCard(cardId: string) {
    this.selectedCard = this.cards.find(card => card.id === cardId)
  }

  @action
  async updateCard(card: Card) {
    this.isLoading = true
    this.error = undefined

    try {
      await this.cardService.updateCard(card)
      runInAction(() => {
        const index = this.cards.findIndex(c => c.id === card.id)
        if (index !== -1) {
          this.cards[index] = card
          if (this.selectedCard?.id === card.id) {
            this.selectedCard = card
          }
        }
        this.isLoading = false
        this.notifier.notify('Card updated successfully')
      })
      return true
    }
    catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update card'
        this.isLoading = false
        this.notifier.notify(this.error)
      })
      return false
    }
  }

  @action
  async deleteCard(cardId: string) {
    this.isLoading = true
    this.error = undefined

    try {
      await this.cardService.deleteCard(cardId)
      runInAction(() => {
        this.cards = this.cards.filter(card => card.id !== cardId)
        if (this.selectedCard?.id === cardId) {
          this.selectedCard = undefined
        }
        this.isLoading = false
        this.notifier.notify('Card deleted successfully')
      })
      return true
    }
    catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to delete card'
        this.isLoading = false
        this.notifier.notify(this.error)
      })
      return false
    }
  }
}

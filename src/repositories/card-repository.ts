import { inject, injectable } from 'inversify'

import type { Card } from '../domain/card'
import type { StorageAdapter } from './storage-adapter'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class CardRepository {
  constructor(
    @inject(SYMBOLS.StorageAdapter) private storage: StorageAdapter,
  ) {}

  async getAll(): Promise<Card[]> {
    return this.storage.getCards()
  }

  async getById(id: string): Promise<Card | undefined> {
    const cards = await this.storage.getCards()
    return cards.find(card => card.id === id)
  }

  async getByDeck(deckId: string): Promise<Card[]> {
    const cards = await this.storage.getCards()
    return cards.filter(card => card.deckId === deckId)
  }

  async create(card: Card): Promise<void> {
    const cards = await this.storage.getCards()
    cards.push(card)
    await this.storage.setCards(cards)
  }

  async update(card: Card): Promise<void> {
    const cards = await this.storage.getCards()
    const index = cards.findIndex(c => c.id === card.id)
    if (index !== -1) {
      cards[index] = card
      await this.storage.setCards(cards)
    }
  }

  async delete(id: string): Promise<void> {
    const cards = await this.storage.getCards()
    const filteredCards = cards.filter(card => card.id !== id)
    await this.storage.setCards(filteredCards)
  }
}

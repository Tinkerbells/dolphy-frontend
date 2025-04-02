import { inject, injectable } from 'inversify'

import type { Deck } from '../domain/deck'
import type { StorageAdapter } from './storage-adapter'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class DeckRepository {
  constructor(
    @inject(SYMBOLS.StorageAdapter) private storage: StorageAdapter,
  ) {}

  async getAll(): Promise<Deck[]> {
    return this.storage.getDecks()
  }

  async getById(id: string): Promise<Deck | undefined> {
    const decks = await this.storage.getDecks()
    return decks.find(deck => deck.id === id)
  }

  async getByOwner(ownerId: string): Promise<Deck[]> {
    const decks = await this.storage.getDecks()
    return decks.filter(deck => deck.owner === ownerId)
  }

  async create(deck: Deck): Promise<void> {
    const decks = await this.storage.getDecks()
    decks.push(deck)
    await this.storage.setDecks(decks)
  }

  async update(deck: Deck): Promise<void> {
    const decks = await this.storage.getDecks()
    const index = decks.findIndex(d => d.id === deck.id)
    if (index !== -1) {
      decks[index] = deck
      await this.storage.setDecks(decks)
    }
  }

  async delete(id: string): Promise<void> {
    const decks = await this.storage.getDecks()
    const filteredDecks = decks.filter(deck => deck.id !== id)
    await this.storage.setDecks(filteredDecks)
  }
}

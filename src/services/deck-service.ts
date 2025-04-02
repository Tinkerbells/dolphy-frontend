import { inject, injectable } from 'inversify'

import type { Deck } from '../domain/deck'
import type { UserService } from './user-service'
import type { DeckRepository } from '../repositories/deck-repository'

import { SYMBOLS } from '../di/symbols'
import { createDeck, updateDeckLastStudied } from '../domain/deck'

@injectable()
export class DeckService {
  constructor(
    @inject(SYMBOLS.DeckRepository) private deckRepository: DeckRepository,
    @inject(SYMBOLS.UserService) private userService: UserService,
  ) {}

  async getAllDecks(): Promise<Deck[]> {
    const user = await this.userService.getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }
    return this.deckRepository.getByOwner(user.id)
  }

  async getDeck(id: string): Promise<Deck | undefined> {
    return this.deckRepository.getById(id)
  }

  async createDeck(title: string, description: string, tags: string[] = []): Promise<Deck> {
    const user = await this.userService.getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Check if title is empty
    if (!title.trim()) {
      throw new Error('Deck title cannot be empty')
    }

    // Check for duplicate names
    const existing = await this.deckRepository.getByOwner(user.id)
    const isDuplicate = existing.some(deck =>
      deck.title.toLowerCase() === title.toLowerCase(),
    )

    if (isDuplicate) {
      throw new Error('You already have a deck with this name')
    }

    const newDeck = createDeck(title, description, user.id, tags)
    await this.deckRepository.create(newDeck)
    return newDeck
  }

  async updateDeck(deck: Deck): Promise<void> {
    await this.deckRepository.update(deck)
  }

  async updateDeckLastStudied(deckId: string): Promise<Deck> {
    const deck = await this.deckRepository.getById(deckId)
    if (!deck) {
      throw new Error('Deck not found')
    }

    const updatedDeck = updateDeckLastStudied(deck)
    await this.deckRepository.update(updatedDeck)
    return updatedDeck
  }

  async deleteDeck(id: string): Promise<void> {
    await this.deckRepository.delete(id)
  }
}

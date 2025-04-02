// src/application/create-deck.ts
import { inject, injectable } from 'inversify'

import type { Deck, DeckDescription, DeckTitle } from '../domain/deck'
import type { DeckStorageService, NotificationService, UserStorageService } from './ports'

import { SYMBOLS } from '../di/symbols'
import { createDeck } from '../domain/deck'
// Keep the old hook for backward compatibility during transition

@injectable()
export class CreateDeckService {
  constructor(
    @inject(SYMBOLS.DeckStorageService) private storage: DeckStorageService,
    @inject(SYMBOLS.UserStorageService) private userStorage: UserStorageService,
    @inject(SYMBOLS.NotificationService) private notifier: NotificationService,
  ) {}

  async createNewDeck(title: DeckTitle, description: DeckDescription, tags: string[] = []): Promise<Deck | undefined> {
    if (!this.userStorage.user) {
      this.notifier.notify('You need to be logged in to create a deck')
      return undefined
    }

    if (!title.trim()) {
      this.notifier.notify('Deck title cannot be empty')
      return undefined
    }

    // Check for duplicate names
    const isDuplicate = this.storage.decks.some(deck =>
      deck.title.toLowerCase() === title.toLowerCase()
      && deck.owner === this.userStorage.user!.id,
    )

    if (isDuplicate) {
      this.notifier.notify('You already have a deck with this name')
      return undefined
    }

    try {
      const deck = createDeck(title, description, this.userStorage.user.id, tags)
      this.storage.createDeck(deck)
      this.notifier.notify(`Deck "${title}" created successfully`)
      return deck
    }
    catch (error) {
      this.notifier.notify('Failed to create deck')
      console.error('Create deck error:', error)
      return undefined
    }
  }
}

// src/application/createDeck.ts
import type { Deck, DeckDescription, DeckTitle } from '../domain/deck'
import type { DeckStorageService, NotificationService, UserStorageService } from './ports'

import { createDeck } from '../domain/deck'
import { useNotifier } from '../services/notification-adapter'
import { useDecksStorage, useUserStorage } from '../services/storage-adapter'

export function useCreateDeck() {
  const storage: DeckStorageService = useDecksStorage()
  const userStorage: UserStorageService = useUserStorage()
  const notifier: NotificationService = useNotifier()

  async function createNewDeck(title: DeckTitle, description: DeckDescription, tags: string[] = []): Promise<Deck | undefined> {
    if (!userStorage.user) {
      notifier.notify('You need to be logged in to create a deck')
      return undefined
    }

    if (!title.trim()) {
      notifier.notify('Deck title cannot be empty')
      return undefined
    }

    // Check for duplicate names
    const isDuplicate = storage.decks.some(deck =>
      deck.title.toLowerCase() === title.toLowerCase()
      && deck.owner === userStorage.user!.id,
    )

    if (isDuplicate) {
      notifier.notify('You already have a deck with this name')
      return undefined
    }

    try {
      const deck = createDeck(title, description, userStorage.user.id, tags)
      storage.createDeck(deck)
      notifier.notify(`Deck "${title}" created successfully`)
      return deck
    }
    catch (error) {
      notifier.notify('Failed to create deck')
      console.error('Create deck error:', error)
      return undefined
    }
  }

  return { createNewDeck }
}

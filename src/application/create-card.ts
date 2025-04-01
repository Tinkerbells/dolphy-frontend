// src/application/create-card.ts
import { inject, injectable } from 'inversify'

import type { Card, CardFace } from '../domain/card'
import type { CardStorageService, DeckStorageService, NotificationService } from './ports'

import { SYMBOLS } from '../di/symbols'
import { createCard } from '../domain/card'
// Keep the old hook for backward compatibility during transition
import { useNotifier } from '../services/notification-adapter'
import { useCardsStorage, useDecksStorage } from '../services/storage-adapter'

@injectable()
export class CreateCardService {
  constructor(
    @inject(SYMBOLS.CardStorageService) private cardStorage: CardStorageService,
    @inject(SYMBOLS.DeckStorageService) private deckStorage: DeckStorageService,
    @inject(SYMBOLS.NotificationService) private notifier: NotificationService,
  ) {}

  async createNewCard(
    front: CardFace,
    back: CardFace,
    deckId: UniqueId,
    tags: string[] = [],
  ): Promise<Card | undefined> {
    // Validate input
    if (!front.trim() || !back.trim()) {
      this.notifier.notify('Card front and back cannot be empty')
      return undefined
    }

    // Check if deck exists
    const deck = this.deckStorage.getDeck(deckId)
    if (!deck) {
      this.notifier.notify('Deck not found')
      return undefined
    }

    try {
      // Create the card
      const card = createCard(front, back, deckId, tags)

      // Save the card
      this.cardStorage.createCard(card)

      // Update deck stats
      const deckCards = this.cardStorage.getCardsByDeck(deckId)
      const updatedDeck = {
        ...deck,
        cardCount: deckCards.length,
        newCount: deckCards.filter(c => c.status === 'new').length,
      }
      this.deckStorage.updateDeck(updatedDeck)

      this.notifier.notify('Card created successfully')
      return card
    }
    catch (error) {
      this.notifier.notify('Failed to create card')
      console.error('Create card error:', error)
      return undefined
    }
  }

  async createBulkCards(
    cards: Array<{ front: CardFace, back: CardFace, tags?: string[] }>,
    deckId: UniqueId,
  ): Promise<Card[]> {
    // Check if deck exists
    const deck = this.deckStorage.getDeck(deckId)
    if (!deck) {
      this.notifier.notify('Deck not found')
      return []
    }

    try {
      // Create and save all cards
      const newCards = cards
        .filter(card => card.front.trim() && card.back.trim())
        .map(card => createCard(card.front, card.back, deckId, card.tags || []))

      // Skip if no valid cards
      if (newCards.length === 0) {
        this.notifier.notify('No valid cards to create')
        return []
      }

      // Save each card
      newCards.forEach(card => this.cardStorage.createCard(card))

      // Update deck stats
      const deckCards = this.cardStorage.getCardsByDeck(deckId)
      const updatedDeck = {
        ...deck,
        cardCount: deckCards.length,
        newCount: deckCards.filter(c => c.status === 'new').length,
      }
      this.deckStorage.updateDeck(updatedDeck)

      this.notifier.notify(`${newCards.length} cards created successfully`)
      return newCards
    }
    catch (error) {
      this.notifier.notify('Failed to create cards')
      console.error('Create bulk cards error:', error)
      return []
    }
  }
}

export function useCreateCard() {
  const cardStorage = useCardsStorage()
  const deckStorage = useDecksStorage()
  const notifier = useNotifier()

  return new CreateCardService(cardStorage, deckStorage, notifier)
}

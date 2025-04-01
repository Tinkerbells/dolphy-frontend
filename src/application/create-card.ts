// src/application/createCard.ts
import type { Card, CardFace } from '../domain/card'
import type { CardStorageService, DeckStorageService, NotificationService } from './ports'

import { createCard } from '../domain/card'
import { useNotifier } from '../services/notification-adapter'
import { useCardsStorage, useDecksStorage } from '../services/storage-adapter'

export function useCreateCard() {
  const cardStorage: CardStorageService = useCardsStorage()
  const deckStorage: DeckStorageService = useDecksStorage()
  const notifier: NotificationService = useNotifier()

  async function createNewCard(
    front: CardFace,
    back: CardFace,
    deckId: UniqueId,
    tags: string[] = [],
  ): Promise<Card | undefined> {
    // Validate input
    if (!front.trim() || !back.trim()) {
      notifier.notify('Card front and back cannot be empty')
      return undefined
    }

    // Check if deck exists
    const deck = deckStorage.getDeck(deckId)
    if (!deck) {
      notifier.notify('Deck not found')
      return undefined
    }

    try {
      // Create the card
      const card = createCard(front, back, deckId, tags)

      // Save the card
      cardStorage.createCard(card)

      // Update deck stats
      const deckCards = cardStorage.getCardsByDeck(deckId)
      const updatedDeck = {
        ...deck,
        cardCount: deckCards.length,
        newCount: deckCards.filter(c => c.status === 'new').length,
      }
      deckStorage.updateDeck(updatedDeck)

      notifier.notify('Card created successfully')
      return card
    }
    catch (error) {
      notifier.notify('Failed to create card')
      console.error('Create card error:', error)
      return undefined
    }
  }

  async function createBulkCards(
    cards: Array<{ front: CardFace, back: CardFace, tags?: string[] }>,
    deckId: UniqueId,
  ): Promise<Card[]> {
    // Check if deck exists
    const deck = deckStorage.getDeck(deckId)
    if (!deck) {
      notifier.notify('Deck not found')
      return []
    }

    try {
      // Create and save all cards
      const newCards = cards
        .filter(card => card.front.trim() && card.back.trim())
        .map(card => createCard(card.front, card.back, deckId, card.tags || []))

      // Skip if no valid cards
      if (newCards.length === 0) {
        notifier.notify('No valid cards to create')
        return []
      }

      // Save each card
      newCards.forEach(card => cardStorage.createCard(card))

      // Update deck stats
      const deckCards = cardStorage.getCardsByDeck(deckId)
      const updatedDeck = {
        ...deck,
        cardCount: deckCards.length,
        newCount: deckCards.filter(c => c.status === 'new').length,
      }
      deckStorage.updateDeck(updatedDeck)

      notifier.notify(`${newCards.length} cards created successfully`)
      return newCards
    }
    catch (error) {
      notifier.notify('Failed to create cards')
      console.error('Create bulk cards error:', error)
      return []
    }
  }

  return { createNewCard, createBulkCards }
}

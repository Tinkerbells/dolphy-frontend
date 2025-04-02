import { inject, injectable } from 'inversify'

import type { Card, CardFace } from '../domain/card'
import type { CardRepository } from '../repositories/card-repository'
import type { DeckRepository } from '../repositories/deck-repository'

import { SYMBOLS } from '../di/symbols'
import { createCard, updateCardDifficulty } from '../domain/card'

@injectable()
export class CardService {
  constructor(
    @inject(SYMBOLS.CardRepository) private cardRepository: CardRepository,
    @inject(SYMBOLS.DeckRepository) private deckRepository: DeckRepository,
  ) {}

  async getAllCards(): Promise<Card[]> {
    return this.cardRepository.getAll()
  }

  async getCardsByDeck(deckId: string): Promise<Card[]> {
    return this.cardRepository.getByDeck(deckId)
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.cardRepository.getById(id)
  }

  async createCard(front: CardFace, back: CardFace, deckId: string, tags: string[] = []): Promise<Card> {
    // Validate input
    if (!front.trim() || !back.trim()) {
      throw new Error('Card front and back cannot be empty')
    }

    // Check if deck exists
    const deck = await this.deckRepository.getById(deckId)
    if (!deck) {
      throw new Error('Deck not found')
    }

    const newCard = createCard(front, back, deckId, tags)
    await this.cardRepository.create(newCard)

    // Update deck stats
    const deckCards = await this.cardRepository.getByDeck(deckId)
    const updatedDeck = {
      ...deck,
      cardCount: deckCards.length,
      newCount: deckCards.filter(c => c.status === 'new').length,
    }
    await this.deckRepository.update(updatedDeck)

    return newCard
  }

  async updateCard(card: Card): Promise<void> {
    await this.cardRepository.update(card)
  }

  async updateCardDifficulty(cardId: string, difficulty: DifficultyLevel): Promise<Card> {
    const card = await this.cardRepository.getById(cardId)
    if (!card) {
      throw new Error('Card not found')
    }

    const updatedCard = updateCardDifficulty(card, difficulty)
    await this.cardRepository.update(updatedCard)
    return updatedCard
  }

  async deleteCard(id: string): Promise<void> {
    await this.cardRepository.delete(id)
  }
}

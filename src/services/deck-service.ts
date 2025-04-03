import { inject, injectable } from 'inversify'

import { getCurrentDateTime } from '@/common/functions'

import type { DeckDto, Decks } from '../models/decks'
import type { DeckRepository } from '../repositories/deck-repository'
import type { CardRepository } from '../repositories/card-repository'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class DeckService {
  constructor(
    @inject(SYMBOLS.DeckRepository) private deckRepository: DeckRepository,
    @inject(SYMBOLS.CardRepository) private cardRepository: CardRepository,
  ) {}

  async getDecks(userId: string): Promise<Decks> {
    return this.deckRepository.getDecks(userId)
  }

  async getDeckById(deckId: string): Promise<DeckDto | null> {
    return this.deckRepository.getDeckById(deckId)
  }

  async createDeck(userId: string, title: string, description: string, tags: string[] = []): Promise<DeckDto> {
    // Create the new deck
    const newDeck = await this.deckRepository.createDeck({
      title,
      description,
      owner: userId,
      tags,
    })

    return newDeck
  }

  async updateDeck(deckId: string, updates: Partial<Pick<DeckDto, 'title' | 'description' | 'tags'>>): Promise<DeckDto | null> {
    return this.deckRepository.updateDeck(deckId, updates)
  }

  async deleteDeck(deckId: string): Promise<boolean> {
    return this.deckRepository.deleteDeck(deckId)
  }

  async refreshDeckCounts(deckId: string): Promise<DeckDto | null> {
    // Get current stats from the card repository
    const stats = await this.cardRepository.getCardStats(deckId)

    // Update the deck with the latest counts
    return this.deckRepository.updateDeckCounts(deckId, {
      cardCount: stats.total,
      newCount: stats.new,
      reviewCount: stats.review,
      learningCount: stats.learning + stats.relearning,
    })
  }

  async updateLastStudied(deckId: string): Promise<DeckDto | null> {
    return this.deckRepository.updateLastStudied(deckId, getCurrentDateTime())
  }

  async getAllTags(userId: string): Promise<string[]> {
    const decks = await this.deckRepository.getDecks(userId)

    // Collect all tags from all decks
    const tagsSet = new Set<string>()
    decks.forEach((deck) => {
      deck.tags.forEach(tag => tagsSet.add(tag))
    })

    return Array.from(tagsSet).sort()
  }

  async getDecksByTag(userId: string, tag: string): Promise<DeckDto[]> {
    const decks = await this.deckRepository.getDecks(userId)
    return decks.filter(deck => deck.tags.includes(tag))
  }

  async searchDecks(userId: string, query: string): Promise<DeckDto[]> {
    if (!query.trim()) {
      return this.deckRepository.getDecks(userId)
    }

    const decks = await this.deckRepository.getDecks(userId)
    const normalizedQuery = query.toLowerCase().trim()

    return decks.filter(deck =>
      deck.title.toLowerCase().includes(normalizedQuery)
      || deck.description.toLowerCase().includes(normalizedQuery)
      || deck.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)),
    )
  }
}

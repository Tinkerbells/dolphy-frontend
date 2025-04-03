// src/services/card-service.ts

import { inject, injectable } from 'inversify'

import { calculateNewDifficulty, calculateNextDueDate, calculateNextStatus, getCurrentDateTime } from '@/common/functions'

import type { CardDto, Cards } from '../models/cards'
import type { CardRepository } from '../repositories/card-repository'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class CardService {
  constructor(
    @inject(SYMBOLS.CardRepository) private cardRepository: CardRepository,
  ) {}

  async getCardsByDeck(deckId: string): Promise<Cards> {
    return this.cardRepository.getCards(deckId)
  }

  async getCard(cardId: string): Promise<CardDto | null> {
    return this.cardRepository.getCardById(cardId)
  }

  async createCard(deckId: string, front: string, back: string, tags: string[] = []): Promise<CardDto> {
    return this.cardRepository.createCard({
      deckId,
      front,
      back,
      difficulty: 0,
      status: 'new',
      tags,
    })
  }

  async updateCard(
    cardId: string,
    updates: Partial<Pick<CardDto, 'front' | 'back' | 'tags'>>,
  ): Promise<CardDto | null> {
    return this.cardRepository.updateCard(cardId, updates)
  }

  async deleteCard(cardId: string): Promise<boolean> {
    return this.cardRepository.deleteCard(cardId)
  }

  async getDueCards(deckId: string, limit?: number): Promise<CardDto[]> {
    return this.cardRepository.getDueCards(deckId, limit)
  }

  async recordCardReview(
    cardId: string,
    answer: 'again' | 'hard' | 'good' | 'easy',
  ): Promise<CardDto | null> {
    // Получаем текущую карточку
    const card = await this.cardRepository.getCardById(cardId)
    if (!card)
      return null

    // Рассчитываем новую сложность
    const newDifficulty = calculateNewDifficulty(card.difficulty, answer)

    // Рассчитываем новый статус
    const newStatus = calculateNextStatus(card.status, answer)

    // Рассчитываем дату следующего повторения
    const dueDate = calculateNextDueDate(newDifficulty, newStatus, answer)

    // Обновляем карточку
    return this.cardRepository.updateCard(cardId, {
      difficulty: newDifficulty,
      status: newStatus,
      dueDate,
      lastReviewed: getCurrentDateTime(),
    })
  }

  async bulkCreateCards(deckId: string, cards: Array<{ front: string, back: string, tags?: string[] }>): Promise<CardDto[]> {
    const cardsToCreate = cards.map(card => ({
      deckId,
      front: card.front,
      back: card.back,
      difficulty: 0,
      status: 'new' as const,
      tags: card.tags || [],
    }))

    return this.cardRepository.bulkCreateCards(cardsToCreate)
  }

  async resetCard(cardId: string): Promise<CardDto | null> {
    return this.cardRepository.updateCard(cardId, {
      difficulty: 0,
      status: 'new',
      dueDate: undefined,
      lastReviewed: undefined,
    })
  }

  async getCardStats(deckId: string): Promise<{
    total: number
    new: number
    learning: number
    review: number
    relearning: number
    dueNow: number
  }> {
    return this.cardRepository.getCardStats(deckId)
  }
}

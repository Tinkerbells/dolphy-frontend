// src/repositories/card-repository.ts

import { injectable } from 'inversify'

import { generateId, getCurrentDateTime } from '@/common/functions'

import type { CardDto } from '../models/cards'

import { Cards } from '../models/cards'
import { createMockCollection, mockRequest } from '../lib/mock/mock-request'

@injectable()
export class CardRepository {
  private mockCardCollection: ReturnType<typeof createMockCollection<CardDto>>

  constructor() {
    // Инициализация начальных карточек
    const initialCards: CardDto[] = [
      {
        id: 'card1',
        deckId: '1', // Spanish Vocabulary
        front: 'Hello',
        back: 'Hola',
        created: '2023-01-15T15:30:00.000Z',
        lastReviewed: '2023-02-20T18:45:00.000Z',
        difficulty: 2,
        status: 'review',
        dueDate: '2023-03-05T18:45:00.000Z',
        tags: ['greeting'],
      },
      {
        id: 'card2',
        deckId: '1', // Spanish Vocabulary
        front: 'Goodbye',
        back: 'Adiós',
        created: '2023-01-15T15:35:00.000Z',
        lastReviewed: '2023-02-15T10:20:00.000Z',
        difficulty: 3,
        status: 'review',
        dueDate: '2023-03-01T10:20:00.000Z',
        tags: ['greeting'],
      },
      {
        id: 'card3',
        deckId: '1', // Spanish Vocabulary
        front: 'Thank you',
        back: 'Gracias',
        created: '2023-01-15T15:40:00.000Z',
        difficulty: 0,
        status: 'new',
        tags: ['common', 'courtesy'],
      },
      {
        id: 'card4',
        deckId: '2', // JavaScript Fundamentals
        front: 'What is a closure?',
        back: 'A closure is a function that has access to its outer function scope even after the outer function has returned.',
        created: '2023-03-05T10:00:00.000Z',
        lastReviewed: '2023-03-10T16:20:00.000Z',
        difficulty: 4,
        status: 'learning',
        dueDate: '2023-03-11T16:20:00.000Z',
        tags: ['functions', 'advanced'],
      },
      {
        id: 'card5',
        deckId: '2', // JavaScript Fundamentals
        front: 'What is hoisting?',
        back: 'Hoisting is JavaScript\'s default behavior of moving all declarations to the top of the current scope.',
        created: '2023-03-05T10:15:00.000Z',
        difficulty: 0,
        status: 'new',
        tags: ['basics', 'variables'],
      },
    ]

    // Добавляем карточки со столицами мира
    const capitals = [
      { country: 'France', capital: 'Paris' },
      { country: 'Japan', capital: 'Tokyo' },
      { country: 'Brazil', capital: 'Brasília' },
      { country: 'Egypt', capital: 'Cairo' },
      { country: 'Australia', capital: 'Canberra' },
    ]

    capitals.forEach((item, index) => {
      initialCards.push({
        id: `capital${index + 1}`,
        deckId: '3', // World Capitals deck
        front: `What is the capital of ${item.country}?`,
        back: item.capital,
        created: '2023-02-10T12:00:00.000Z',
        difficulty: 0,
        status: 'new',
        tags: ['capitals', item.country.toLowerCase()],
      })
    })

    // Создаем коллекцию с мок-данными
    this.mockCardCollection = createMockCollection<CardDto>(initialCards)
  }

  /**
   * Получает все карточки для указанной колоды
   */
  async getCards(deckId: string): Promise<Cards> {
    const cards = await this.mockCardCollection.getAll({ delay: 300 })
    const data = cards.filter(card => card.deckId === deckId)
    return new Cards(data)
  }

  /**
   * Получает карточку по ID
   */
  async getCardById(id: string): Promise<CardDto | null> {
    return this.mockCardCollection.getById(id, { delay: 200 })
  }

  /**
   * Получает карточки, которые пора изучать
   */
  async getDueCards(deckId: string, limit?: number): Promise<CardDto[]> {
    const cards = await this.mockCardCollection.getAll({ delay: 250 })
    const now = new Date().toISOString()

    // Фильтруем карточки, которые пора изучать
    let dueCards = cards.filter(card =>
      card.deckId === deckId
      && (card.status === 'new' || !card.dueDate || card.dueDate <= now),
    )

    // Сортируем по приоритету статуса: new -> learning -> relearning -> review
    dueCards.sort((a, b) => {
      const statusPriority = {
        new: 0,
        learning: 1,
        relearning: 2,
        review: 3,
      }
      return statusPriority[a.status] - statusPriority[b.status]
    })

    // Ограничиваем количество, если указан лимит
    if (limit) {
      dueCards = dueCards.slice(0, limit)
    }

    return mockRequest({ data: dueCards })
  }

  /**
   * Создает новую карточку
   */
  async createCard(card: Omit<CardDto, 'id' | 'created'>): Promise<CardDto> {
    const newCard: CardDto = {
      id: generateId(),
      created: getCurrentDateTime(),
      ...card,
    }

    return this.mockCardCollection.create(newCard, { delay: 400 })
  }

  /**
   * Обновляет существующую карточку
   */
  async updateCard(id: string, updates: Partial<Omit<CardDto, 'id' | 'created' | 'deckId'>>): Promise<CardDto | null> {
    return this.mockCardCollection.update(id, updates, { delay: 300 })
  }

  /**
   * Удаляет карточку
   */
  async deleteCard(id: string): Promise<boolean> {
    return this.mockCardCollection.delete(id, { delay: 250 })
  }

  /**
   * Создает несколько карточек
   */
  async bulkCreateCards(cards: Omit<CardDto, 'id' | 'created'>[]): Promise<CardDto[]> {
    const newCards = await Promise.all(
      cards.map(card => this.createCard(card)),
    )

    return mockRequest({ data: newCards, delay: 500 })
  }

  /**
   * Получает статистику карточек для колоды
   */
  async getCardStats(deckId: string): Promise<{
    total: number
    new: number
    learning: number
    review: number
    relearning: number
    dueNow: number
  }> {
    const cards = await this.mockCardCollection.getAll({ delay: 200 })
    const deckCards = cards.filter(card => card.deckId === deckId)
    const now = new Date().toISOString()

    return {
      total: deckCards.length,
      new: deckCards.filter(card => card.status === 'new').length,
      learning: deckCards.filter(card => card.status === 'learning').length,
      review: deckCards.filter(card => card.status === 'review').length,
      relearning: deckCards.filter(card => card.status === 'relearning').length,
      dueNow: deckCards.filter(card =>
        card.status === 'new'
        || !card.dueDate
        || card.dueDate <= now,
      ).length,
    }
  }

  /**
   * Получает карточки по тегу
   */
  async getCardsByTag(deckId: string, tag: string): Promise<CardDto[]> {
    const cards = await this.mockCardCollection.getAll({ delay: 250 })
    return cards.filter(
      card => card.deckId === deckId && card.tags.includes(tag),
    )
  }

  /**
   * Получает все уникальные теги в колоде
   */
  async getCardTags(deckId: string): Promise<string[]> {
    const cards = await this.mockCardCollection.getAll({ delay: 200 })
    const deckCards = cards.filter(card => card.deckId === deckId)

    const tagsSet = new Set<string>()
    deckCards.forEach((card) => {
      card.tags.forEach(tag => tagsSet.add(tag))
    })

    return Array.from(tagsSet).sort()
  }

  /**
   * Удаляет все карточки для указанной колоды
   */
  async deleteCardsByDeck(deckId: string): Promise<boolean> {
    const cards = await this.mockCardCollection.getAll({ delay: 200 })
    const cardsToDelete = cards.filter(card => card.deckId === deckId)

    let allDeleted = true
    for (const card of cardsToDelete) {
      const result = await this.mockCardCollection.delete(card.id, { delay: 50 })
      if (!result)
        allDeleted = false
    }

    return mockRequest({ data: allDeleted, delay: 300 })
  }

  /**
   * Сбрасывает статус карточки на "новая"
   */
  async resetCardStatus(id: string): Promise<CardDto | null> {
    return this.mockCardCollection.update(id, {
      difficulty: 0,
      status: 'new',
      dueDate: undefined,
      lastReviewed: undefined,
    }, { delay: 200 })
  }

  /**
   * Обновляет теги карточки
   */
  async updateCardTags(id: string, tags: string[]): Promise<CardDto | null> {
    return this.mockCardCollection.update(id, { tags }, { delay: 200 })
  }

  /**
   * Поиск карточек по тексту
   */
  async searchCards(deckId: string, query: string): Promise<CardDto[]> {
    const cards = await this.mockCardCollection.getAll({ delay: 300 })

    if (!query.trim()) {
      return cards.filter(card => card.deckId === deckId)
    }

    const normalizedQuery = query.toLowerCase().trim()

    return cards.filter(card =>
      card.deckId === deckId && (
        card.front.toLowerCase().includes(normalizedQuery)
        || card.back.toLowerCase().includes(normalizedQuery)
        || card.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
      ),
    )
  }
}

import { injectable } from 'inversify'

import { generateId, getCurrentDateTime } from '@/common/functions'

import type { CardDto } from '../models/cards'

@injectable()
export class CardRepository {
  private cards: CardDto[] = []

  constructor() {
    // Initialize with mock data
    this.cards = [
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

    // Add world capitals cards
    const capitals = [
      { country: 'France', capital: 'Paris' },
      { country: 'Japan', capital: 'Tokyo' },
      { country: 'Brazil', capital: 'Brasília' },
      { country: 'Egypt', capital: 'Cairo' },
      { country: 'Australia', capital: 'Canberra' },
    ]

    capitals.forEach((item, index) => {
      this.cards.push({
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
  }

  async getCards(deckId: string): Promise<CardDto[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.cards.filter(card => card.deckId === deckId)
  }

  async getCardById(id: string): Promise<CardDto | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const card = this.cards.find(card => card.id === id)
    return card || null
  }

  async getDueCards(deckId: string, limit?: number): Promise<CardDto[]> {
    await new Promise(resolve => setTimeout(resolve, 250))

    const now = new Date().toISOString()
    let dueCards = this.cards.filter(card =>
      card.deckId === deckId
      && (card.status === 'new' || !card.dueDate || card.dueDate <= now),
    )

    // Sort by status priority: new -> learning -> relearning -> review
    dueCards.sort((a, b) => {
      const statusPriority = {
        new: 0,
        learning: 1,
        relearning: 2,
        review: 3,
      }
      return statusPriority[a.status] - statusPriority[b.status]
    })

    if (limit) {
      dueCards = dueCards.slice(0, limit)
    }

    return dueCards
  }

  async createCard(card: Omit<CardDto, 'id' | 'created'>): Promise<CardDto> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const newCard: CardDto = {
      id: generateId(),
      created: getCurrentDateTime(),
      ...card,
    }

    this.cards.push(newCard)
    return newCard
  }

  async updateCard(id: string, updates: Partial<Omit<CardDto, 'id' | 'created' | 'deckId'>>): Promise<CardDto | null> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const index = this.cards.findIndex(card => card.id === id)
    if (index === -1)
      return null

    this.cards[index] = {
      ...this.cards[index],
      ...updates,
    }

    return this.cards[index]
  }

  async deleteCard(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 250))

    const initialLength = this.cards.length
    this.cards = this.cards.filter(card => card.id !== id)

    return this.cards.length < initialLength
  }

  async bulkCreateCards(cards: Omit<CardDto, 'id' | 'created'>[]): Promise<CardDto[]> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const newCards = cards.map(card => ({
      id: generateId(),
      created: getCurrentDateTime(),
      ...card,
    }))

    this.cards.push(...newCards)
    return newCards
  }

  async getCardStats(deckId: string): Promise<{
    total: number
    new: number
    learning: number
    review: number
    relearning: number
    dueNow: number
  }> {
    await new Promise(resolve => setTimeout(resolve, 200))

    const deckCards = this.cards.filter(card => card.deckId === deckId)
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
}

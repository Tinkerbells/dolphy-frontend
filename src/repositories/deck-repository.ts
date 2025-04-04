import { injectable } from 'inversify'

import { generateId, getCurrentDateTime } from '@/common/functions'

import type { DeckDto } from '../models/decks'

import { Decks } from '../models/decks'

@injectable()
export class DeckRepository {
  private decks: DeckDto[] = []

  constructor() {
    // Initialize with mock data
    this.decks = [
      {
        id: '1',
        title: 'Spanish Vocabulary',
        description: 'Basic Spanish words and phrases',
        created: '2023-01-15T14:30:00.000Z',
        lastStudied: '2023-02-20T18:45:00.000Z',
        owner: '1',
        tags: ['language', 'spanish', 'beginner'],
        cardCount: 50,
        newCount: 10,
        reviewCount: 15,
        learningCount: 5,
      },
      {
        id: '2',
        title: 'JavaScript Fundamentals',
        description: 'Core JavaScript concepts and syntax',
        created: '2023-03-05T09:15:00.000Z',
        lastStudied: '2023-03-10T16:20:00.000Z',
        owner: '1',
        tags: ['programming', 'javascript', 'web'],
        cardCount: 45,
        newCount: 5,
        reviewCount: 30,
        learningCount: 10,
      },
      {
        id: '3',
        title: 'World Capitals',
        description: 'Countries and their capital cities',
        created: '2023-02-10T11:30:00.000Z',
        owner: '1',
        tags: ['geography', 'capitals'],
        cardCount: 30,
        newCount: 30,
        reviewCount: 0,
        learningCount: 0,
      },
      {
        id: '4',
        title: 'English Vocabulary',
        description: 'Basic English words and phrases',
        created: '2023-01-15T14:30:00.000Z',
        lastStudied: '2023-02-20T18:45:00.000Z',
        owner: '1',
        tags: ['language', 'english', 'beginner'],
        cardCount: 50,
        newCount: 10,
        reviewCount: 15,
        learningCount: 5,
      },
    ]
  }

  async getDecks(userId: string): Promise<Decks> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    const data = this.decks.filter(deck => deck.owner === userId)
    return new Decks(data)
  }

  async getDeckById(id: string): Promise<DeckDto | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const deck = this.decks.find(deck => deck.id === id)
    return deck || null
  }

  async createDeck(deck: Omit<DeckDto, 'id' | 'created' | 'cardCount' | 'newCount' | 'reviewCount' | 'learningCount'>): Promise<DeckDto> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const newDeck: DeckDto = {
      id: generateId(),
      created: getCurrentDateTime(),
      cardCount: 0,
      newCount: 0,
      reviewCount: 0,
      learningCount: 0,
      ...deck,
    }

    this.decks.push(newDeck)
    return newDeck
  }

  async updateDeck(id: string, updates: Partial<Omit<DeckDto, 'id' | 'created' | 'owner'>>): Promise<DeckDto | null> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const index = this.decks.findIndex(deck => deck.id === id)
    if (index === -1)
      return null

    this.decks[index] = {
      ...this.decks[index],
      ...updates,
    }

    return this.decks[index]
  }

  async deleteDeck(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 250))

    const initialLength = this.decks.length
    this.decks = this.decks.filter(deck => deck.id !== id)

    return this.decks.length < initialLength
  }

  async updateDeckCounts(id: string, counts: {
    cardCount?: number
    newCount?: number
    reviewCount?: number
    learningCount?: number
  }): Promise<DeckDto | null> {
    await new Promise(resolve => setTimeout(resolve, 200))

    const index = this.decks.findIndex(deck => deck.id === id)
    if (index === -1)
      return null

    this.decks[index] = {
      ...this.decks[index],
      ...counts,
    }

    return this.decks[index]
  }

  async updateLastStudied(id: string, timestamp: string = getCurrentDateTime()): Promise<DeckDto | null> {
    await new Promise(resolve => setTimeout(resolve, 100))

    const index = this.decks.findIndex(deck => deck.id === id)
    if (index === -1)
      return null

    this.decks[index].lastStudied = timestamp

    return this.decks[index]
  }
}

import type { HttpClient } from '@/common/services/http-client'

import { http } from '@/common/services/http-client'

import type { CardWithContent } from '../models/card.domain'
import type { CardsRepository } from '../models/repositories/cards.repository'

/**
 * Сервис для работы с карточками
 */
class CardsService implements CardsRepository {
  private readonly baseUrl = 'cards'
  constructor(private readonly http: HttpClient) {}
  async findById(id: string): Promise<CardWithContent> {
    return this.http.get<CardWithContent>({ path: `${this.baseUrl}/${id}` })
  }

  async findByDeckId(deckId: string): Promise<CardWithContent[]> {
    return this.http.get<CardWithContent[]>({ path: `${this.baseUrl}/deck/${deckId}` })
  }

  async findDueByDeckId(deckId: string): Promise<CardWithContent[]> {
    return this.http.get<CardWithContent[]>({ path: `${this.baseUrl}/due/deck/${deckId}` })
  }

  async findDueCards(): Promise<CardWithContent[]> {
    return this.http.get<CardWithContent[]>({ path: `${this.baseUrl}/due` })
  }
}

export const cardsService = new CardsService(http)

import type { HttpClient } from '@/common/services/http-client'
import type { OperationResultDto, PaginationResponseDto } from '@/types'

import { http } from '@/common/services/http-client'

import type { Deck } from '../models/deck.domain'
import type { CreateDeckDto, UpdateDeckDto } from '../models/dto'
import type { DeckRepository } from '../models/repositories/deck.repository'

class DeckService implements DeckRepository {
  private readonly baseUrl = 'decks'
  constructor(
    private readonly http: HttpClient,
  ) {}

  async findAll(): Promise<PaginationResponseDto<Deck>> {
    const res = await this.http.get<PaginationResponseDto<Deck>>({ path: this.baseUrl })
    return res
  }

  async findById(id: Deck['id']): Promise<Deck> {
    return this.http.get<Deck>({ path: `${this.baseUrl}/${id}` })
  }

  async create(data: CreateDeckDto): Promise<Deck> {
    return await this.http.post<Deck>({ path: this.baseUrl, body: data })
  }

  async update(id: Deck['id'], data: UpdateDeckDto): Promise<Deck> {
    return await this.http.patch<Deck>({ path: `${this.baseUrl}/${id}`, body: data })
  }

  async remove(id: Deck['id']): Promise<OperationResultDto> {
    return await this.http.delete<OperationResultDto>({ path: `${this.baseUrl}/${id}` })
  }
}

export const deckService = new DeckService(http)

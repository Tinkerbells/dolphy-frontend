import { inject, injectable } from 'inversiland'

import type { PaginationResponseDto } from '@/types'
import type { HttpClientPort } from '@/core/domain/ports/http-client.port'
import type { CreateDeckDto, Deck, IDeckRepository, UpdateDeckDto } from '@/decks/domain'

import { HttpClientPortToken } from '@/core/domain/ports/http-client.port'

@injectable()
export class DeckRepository implements IDeckRepository {
  private readonly baseUrl = 'decks'
  constructor(
    @inject(HttpClientPortToken) private readonly http: HttpClientPort,
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

  async remove(id: Deck['id']): Promise<void> {
    return await this.http.delete<void>({ path: `${this.baseUrl}/${id}` })
  }
}

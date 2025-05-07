import { injectable } from 'inversify'

import type { PaginationResponseDto } from '@/utils'
import type { CreateDeckDto, Deck, DeckRepository, UpdateDeckDto } from '@/domain'

import { HttpClient } from '../adapters'

@injectable()
export class DeckNetRepository extends HttpClient implements DeckRepository {
  constructor() {
    super()
  }

  async findAll(): Promise<PaginationResponseDto<Deck>> {
    return this._send({ path: 'decks' })
  }

  async findById(id: Deck['id']): Promise<Deck> {
    return this._send({ path: `decks/${id}` })
  }

  async create(data: CreateDeckDto): Promise<Deck> {
    return this._send({ path: 'decks', method: 'POST', body: data })
  }

  async update(id: Deck['id'], data: UpdateDeckDto): Promise<Deck> {
    return this._send({ path: `decks/${id}`, method: 'PATCH', body: data })
  }

  async remove(id: Deck['id']): Promise<void> {
    return this._send({ path: `decks/${id}`, method: 'DELETE' })
  }
}

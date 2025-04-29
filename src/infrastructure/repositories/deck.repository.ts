import { injectable } from 'inversify'

import type { PaginationResponseDto } from '@/utils'
import type { CreateDeckDto, Deck, DeckRepository, UpdateDeckDto } from '@/domain'

import { NetService } from '../services/net/net.service'

@injectable()
export class DeckNetRepository extends NetService implements DeckRepository {
  constructor() {
    super()
  }

  async findAll(): Promise<PaginationResponseDto<Deck>> {
    return this._send({ path: 'decks', method: 'get' })
  }

  async findById(id: Deck['id']): Promise<Deck> {
    return this._send({ path: `decks/${id}`, method: 'get' })
  }

  async create(data: CreateDeckDto): Promise<Deck> {
    return this._send({ path: 'decks', method: 'post', body: data })
  }

  async update(id: Deck['id'], data: UpdateDeckDto): Promise<Deck> {
    return this._send({ path: `decks/${id}`, method: 'patch', body: data })
  }

  async remove(id: Deck['id']): Promise<void> {
    return this._send({ path: `decks/${id}`, method: 'delete' })
  }
}

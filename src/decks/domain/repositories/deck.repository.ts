import type { PaginationResponseDto } from '@/types'

import type { Deck } from '../deck.domain'
import type { CreateDeckDto, UpdateDeckDto } from '../dto'

export interface IDeckRepository {
  findAll: () => Promise<PaginationResponseDto<Deck>>
  findById: (id: Deck['id']) => Promise<Deck>
  create: (data: CreateDeckDto) => Promise<Deck>
  update: (id: Deck['id'], data: UpdateDeckDto) => Promise<Deck>
  remove: (id: Deck['id']) => Promise<void>
}

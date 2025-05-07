import type { PaginationResponseDto } from '@/utils'

import type { Deck } from '../deck.domain'
import type { CreateDeckDto, UpdateDeckDto } from '../dto'

export interface DeckRepository {
  findAll: () => Promise<PaginationResponseDto<Deck>>
  findById: (id: Deck['id']) => Promise<Deck>
  create: (data: CreateDeckDto) => Promise<Deck>
  update: (id: Deck['id'], data: UpdateDeckDto) => Promise<Deck>
  remove: (id: Deck['id']) => Promise<void>
}

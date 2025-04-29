import type { Deck } from '../deck.domain'
import type { CreateDeckDto, FindAllDecksDto, UpdateDeckDto } from '../dto'

export interface DeckRepository {
  findAll: () => Promise<FindAllDecksDto>
  findById: (id: string) => Promise<Deck>
  create: (data: CreateDeckDto) => Promise<Deck>
  update: (id: string, data: UpdateDeckDto) => Promise<Deck>
  remove: (id: string) => Promise<void>
}

import type { Deck } from '../../external'
import type { Card } from '../card.domain'

/**
 * Интерфейс репозитория для работы с карточками
 */
export interface CardsRepository {
  // TODO: добавить закоментированные методы
  // findAll: (params?: FindCardsParams) => Promise<PaginationResponseDto<Card[]>>
  findById: (id: string) => Promise<Card>
  findByDeckId: (deckId: Deck['id']) => Promise<Card[]>
  // create: (data: CreateCardDto) => Promise<FsrsCardWithContent>
  // update: (id: string, data: Partial<CreateCardDto>) => Promise<FsrsCardWithContent>
  // remove: (id: string) => Promise<OperationResultDto>
}

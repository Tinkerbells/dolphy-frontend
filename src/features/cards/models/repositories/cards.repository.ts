import type { Deck } from '../../external'
import type { CardWithContent } from '../card.domain'

/**
 * Интерфейс репозитория для работы с карточками
 */
export interface CardsRepository {
  // findAll: (params?: FindCardsParams) => Promise<PaginationResponseDto<CardWithContent>>
  findById: (id: string) => Promise<CardWithContent>
  findByDeckId: (deckId: Deck['id']) => Promise<CardWithContent[]>
  findDueByDeckId: (deckId: Deck['id']) => Promise<CardWithContent[]>
  findDueCards: () => Promise<CardWithContent[]>
}

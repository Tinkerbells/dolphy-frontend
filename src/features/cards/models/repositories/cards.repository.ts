import type { Deck } from '../../external'
import type { Card, FsrsCardWithContent } from '../card.domain'

/**
 * Интерфейс репозитория для работы с карточками
 */
export interface CardsRepository {
  // findAll: (params?: FindCardsParams) => Promise<PaginationResponseDto<CardWithContent>>
  findById: (id: string) => Promise<Card>
  findByDeckId: (deckId: Deck['id']) => Promise<Card[]>
  findDueByDeckId: (deckId: Deck['id']) => Promise<FsrsCardWithContent[]>
  findDueCards: () => Promise<FsrsCardWithContent[]>
}

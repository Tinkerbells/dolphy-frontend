import type { Deck } from '../../external'
import type { FsrsCardWithContent } from '../fsrs.domain'

export interface FsrsRepository {
  // TODO: добавить закоментированные методы
  findDueByDeckId: (deckId: Deck['id']) => Promise<FsrsCardWithContent[]>
  findDueCards: () => Promise<FsrsCardWithContent[]>
}

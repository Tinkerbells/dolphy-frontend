import type { Deck } from '../../external'
import type { UndoGradeCardDto } from '../dto'
import type { FsrsCardWithContent } from '../fsrs.domain'
import type { GradeCardDto } from '../dto/grade-card.dto'

export interface FsrsRepository {
  // TODO: добавить закоментированные методы
  grade: (dto: GradeCardDto) => Promise<FsrsCardWithContent>
  undoGrade: (dto: UndoGradeCardDto) => Promise<FsrsCardWithContent>
  findDueByDeckId: (deckId: Deck['id']) => Promise<FsrsCardWithContent[]>
  findDueCards: () => Promise<FsrsCardWithContent[]>
}

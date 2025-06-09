import { IsNotEmpty } from 'class-validator'

import type { Card } from '../../external'

export class UndoGradeCardDto {
  @IsNotEmpty()
  cardId: Card['id']
}

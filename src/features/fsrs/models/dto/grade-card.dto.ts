import { IsEnum, IsNotEmpty } from 'class-validator'

import type { Card } from '../../external'

import { Rating } from '../fsrs.domain'

export class GradeCardDto {
  @IsEnum(Rating)
  @IsNotEmpty()
  rating: Rating

  @IsNotEmpty()
  cardId: Card['id']
}

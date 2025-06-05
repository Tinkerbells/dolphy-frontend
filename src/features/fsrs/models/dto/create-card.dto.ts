import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateCardDto {
  @IsString()
  @IsNotEmpty({ message: 'Вопрос карточки обязателен' })
  @MaxLength(1000, { message: 'Вопрос должен быть не более 1000 символов' })
  question: string

  @IsString()
  @IsNotEmpty({ message: 'Ответ карточки обязателен' })
  @MaxLength(2000, { message: 'Ответ должен быть не более 2000 символов' })
  answer: string

  @IsString()
  @IsOptional()
  deckId?: string

  @IsOptional()
  metadata?: {
    tags?: string[]
    source?: string
    sourceId?: string
  }
}

import { Type } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator'

export class CardMetadataDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]

  @IsString()
  @IsOptional()
  filename?: string

  @IsString()
  @IsOptional()
  sourceId?: string
}

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  question: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  answer: string

  @IsString()
  @IsNotEmpty()
  source: string

  @Type(() => CardMetadataDto)
  @IsOptional()
  metadata?: CardMetadataDto

  @IsString()
  @IsUUID('4')
  @IsNotEmpty()
  deckId: string
}

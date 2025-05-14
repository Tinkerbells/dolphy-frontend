import { Transform } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export class FindAllDecksDto {
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number
}

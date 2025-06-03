import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateDeckDto {
  @IsString()
  @MinLength(1, { message: 'Название колоды обязательно' })
  @IsNotEmpty({ message: 'Название колоды обязательно' })
  name: string

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Описание должно быть не более 500 символов' })
  description?: string
}

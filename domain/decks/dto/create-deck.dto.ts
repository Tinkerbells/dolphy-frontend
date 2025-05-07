import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateDeckDto {
  @IsString()
  @IsNotEmpty({ message: 'Название колоды обязательно' })
  name: string

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Описание должно быть не более 500 символов' })
  description?: string
}

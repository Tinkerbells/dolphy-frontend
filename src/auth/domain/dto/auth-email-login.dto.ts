import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer'

export class AuthEmailLoginDto {
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: 'form.email' })
  @IsNotEmpty({ message: 'form.empty' })
  email: string

  @IsNotEmpty({ message: 'form.empty' })
  password: string
}

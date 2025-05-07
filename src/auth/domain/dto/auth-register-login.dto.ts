// import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

// import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer'

export class AuthRegisterLoginDto {
  // @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string

  @MinLength(6)
  password: string

  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string
}

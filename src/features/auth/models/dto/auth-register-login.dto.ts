import i18next from 'i18next'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer'

export class AuthRegisterLoginDto {
  @Transform(lowerCaseTransformer)

  @IsNotEmpty({
    message: () => i18next.t('validation:form.empty'),
  })
  @IsEmail({}, {
    message: () => i18next.t('validation:form.email'),
  })
  email: string

  @IsNotEmpty({
    message: () => i18next.t('validation:form.empty'),
  })
  @MinLength(6, {
    message: () => i18next.t('auth:validation.passwordTooShort'),
  })
  password: string

  @IsNotEmpty({
    message: () => i18next.t('validation:form.empty'),
  })
  firstName: string

  @IsNotEmpty({
    message: () => i18next.t('validation:form.empty'),
  })
  lastName: string
}

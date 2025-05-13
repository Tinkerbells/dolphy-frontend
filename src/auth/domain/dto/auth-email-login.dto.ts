import i18next from 'i18next'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer'

export class AuthEmailLoginDto {
  @Transform(lowerCaseTransformer)
  @IsEmail({}, {
    message: () => i18next.t('validation:form.email'),
  })
  @IsNotEmpty({
    message: () => i18next.t('validation:form.empty'),
  })
  email: string

  @IsNotEmpty({
    message: () => i18next.t('validation:form.empty'),
  })
  password: string
}

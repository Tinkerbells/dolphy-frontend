import { inject, injectable } from 'inversify'

import type { User } from '@/domain'
import type { NullableType } from '@/utils'
import type { AuthRepository } from '@/domain/auth/repositories/auth.repository'

import { Symbols } from '@/di'

@injectable()
export class Profile {
  constructor(
    @inject(Symbols.AuthRepository) private authRepository: AuthRepository,
  ) {}

  async get(): Promise<NullableType<User>> {
    return await this.authRepository.me()
  }
}

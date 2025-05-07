import { inject, injectable } from 'inversify'

import type { NullableType } from '@/utils'
import type { AuthRepository, User } from '@/domain'

import { Symbols } from '@/di'

@injectable()
export class ProfileService {
  constructor(
    @inject(Symbols.AuthRepository) private authRepository: AuthRepository,
  ) {}

  async get(): Promise<NullableType<User>> {
    return await this.authRepository.me()
  }
}

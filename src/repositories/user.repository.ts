import { inject, injectable } from 'inversify'

import type { AuthService } from '@/services/auth.service'
import type { LoginResponseDto } from '@/models/auth/dto/auth.dto'

import { SYMBOLS } from '@/di/symbols'

import type { User, UserDto } from '../models/user/user'

@injectable()
export class UserRepository {
  user: User | null = null
  constructor(
    @inject(SYMBOLS.AuthService) private authService: AuthService,
  ) {}

  async login(): Promise<LoginResponseDto> {
    this.authService.login(email)
  }
}

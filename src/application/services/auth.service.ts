import { inject, injectable } from 'inversify'

import type { LoginResponseDto } from '@/domain/auth/dto/login-response.dto'
import type { AuthEmailLoginDto } from '@/domain/auth/dto/auth-email-login.dto'
import type { AuthRepository } from '@/domain/auth/repositories/auth.repository'
import type { AuthRegisterLoginDto } from '@/domain/auth/dto/auth-register-login.dto'

import { SYMBOLS } from '@/di/symbols'

@injectable()
export class AuthService {
  constructor(
    @inject(SYMBOLS.AuthRepository) private authRepository: AuthRepository,
  ) {}

  async register(createUserDto: AuthRegisterLoginDto): Promise<void> {
    return await this.authRepository.register(createUserDto)
  }

  async login(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    return await this.authRepository.login(loginDto)
  }

  async logout(): Promise<void> {
    return await this.authRepository.logout()
  }
}

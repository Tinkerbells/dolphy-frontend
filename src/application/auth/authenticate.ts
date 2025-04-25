import { inject, injectable } from 'inversify'

import type { PersistPort } from '@/domain'
import type { LoginResponseDto } from '@/domain/auth/dto/login-response.dto'
import type { AuthEmailLoginDto } from '@/domain/auth/dto/auth-email-login.dto'
import type { NotificationPort } from '@/domain/notification/notification.port'
import type { AuthRepository } from '@/domain/auth/repositories/auth.repository'
import type { AuthRegisterLoginDto } from '@/domain/auth/dto/auth-register-login.dto'

import { Symbols } from '@/di'

@injectable()
export class Authenticate {
  constructor(
    @inject(Symbols.AuthRepository) private authRepository: AuthRepository,
    @inject(Symbols.NotificationService) private notificationService: NotificationPort,
    @inject(Symbols.PersistService) private persistService: PersistPort,
  ) {}

  async register(createUserDto: AuthRegisterLoginDto): Promise<void> {
    return await this.authRepository.register(createUserDto)
  }

  async login(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    const res = await this.authRepository.login(loginDto)
    this.notificationService.success('You\'ve login')
    this.persistService.setPrimitive('access_token', res.token)
    this.persistService.setPrimitive('refresh_token', res.refreshToken)
    return res
  }

  async logout(): Promise<void> {
    return await this.authRepository.logout()
  }
}

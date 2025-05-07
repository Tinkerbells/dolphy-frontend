import { inject, injectable } from 'inversify'

import type { NetError } from '@/infrastructure'
import type { AuthEmailLoginDto, AuthRegisterLoginDto, AuthRepository, LoginResponseDto, NotificationPort, PersistPort } from '@/domain'

import { Symbols } from '@/di'
import { ResponseCode } from '@/infrastructure'

@injectable()
export class AuthService {
  constructor(
    @inject(Symbols.AuthRepository) private authRepository: AuthRepository,
    @inject(Symbols.NotificationKey) private notify: NotificationPort,
    @inject(Symbols.PersistService) private persist: PersistPort,
  ) {}

  async register(createUserDto: AuthRegisterLoginDto): Promise<void> {
    try {
      return await this.authRepository.register(createUserDto)
    }
    catch (error) {
      if ((error as NetError).code === ResponseCode.VALIDATION_ERROR) {
        this.notify.error('Incorrect email or password')
        throw error
      }
    }
  }

  async login(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto | undefined> {
    try {
      const res = await this.authRepository.login(loginDto)
      this.persist.setPrimitive('access_token', res.token)
      this.persist.setPrimitive('refresh_token', res.refreshToken)
      return res
    }
    catch (error) {
      if ((error as NetError).code === ResponseCode.VALIDATION_ERROR) {
        this.notify.error('Incorrect email or password')
        throw error
      }
    }
  }

  async logout() {
    try {
      this.persist.remove('access_token')
      this.persist.remove('refresh_token')
      await this.authRepository.logout()
    }
    catch (error) {
      this.notify.error('Failed logout')
      throw error
    }
  }
}

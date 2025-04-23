import { injectable } from 'inversify'

import type { LoginResponseDto } from '@/domain/auth/dto/login-response.dto'
import type { AuthEmailLoginDto } from '@/domain/auth/dto/auth-email-login.dto'
import type { AuthRepository } from '@/domain/auth/repositories/auth.repository'
import type { AuthRegisterLoginDto } from '@/domain/auth/dto/auth-register-login.dto'

import { Net } from '@/utils/net'

@injectable()
export class AuthNetRepository extends Net implements AuthRepository {
  constructor() {
    super()
  }

  async register(createUserDto: AuthRegisterLoginDto): Promise<void> {
    return this._send<void>({ path: 'register', body: createUserDto })
  }

  async login(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    return this._send<LoginResponseDto>({ path: 'login', body: loginDto })
  }

  async logout(): Promise<void> {
    return this._send<void>({ path: 'logout', method: 'post' })
  }
}

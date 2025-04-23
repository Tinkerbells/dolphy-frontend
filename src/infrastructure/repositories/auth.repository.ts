import type { LoginResponseDto } from '@/domain/auth/dto/login-response.dto'
import type { AuthEmailLoginDto } from '@/domain/auth/dto/auth-email-login.dto'
import type { AuthRepository } from '@/domain/auth/repositories/auth.repository'
import type { AuthRegisterLoginDto } from '@/domain/auth/dto/auth-register-login.dto'

import { Net } from '@/utils/net'

export class AuthNetRepository extends Net implements AuthRepository {
  constructor() {
    super()
  }

  async register(createUserDto: AuthRegisterLoginDto): Promise<void> {
    const { promise } = this._send<void>({ path: 'register', key: 'auth', body: createUserDto })
    return promise
  }

  async login(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    const { promise } = this._send<LoginResponseDto>({ path: 'login', key: 'auth', body: loginDto })
    return promise
  }

  async logout(): Promise<void> {
    const { promise } = this._send<void>({ path: 'logout', key: 'auth', method: 'post' })
    return promise
  }
}

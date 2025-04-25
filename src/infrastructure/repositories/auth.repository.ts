import { injectable } from 'inversify'

import type { AuthEmailLoginDto, AuthRegisterLoginDto, AuthRepository, LoginResponseDto } from '@/domain'

import { NetService } from '../services/net/net.service'

@injectable()
export class AuthNetRepository extends NetService implements AuthRepository {
  constructor() {
    super()
  }

  async register(createUserDto: AuthRegisterLoginDto): Promise<void> {
    return this._send<void>({ path: 'auth/email/register', body: createUserDto, method: 'post' })
  }

  async login(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    return this._send<LoginResponseDto>({ path: 'auth/email/login', body: loginDto, method: 'post' })
  }

  async logout(): Promise<void> {
    return this._send<void>({ path: 'auth/logout', method: 'post' })
  }
}

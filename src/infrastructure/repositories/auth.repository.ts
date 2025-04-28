import { injectable } from 'inversify'

import type { NullableType } from '@/utils'
import type { AuthEmailLoginDto, AuthRegisterLoginDto, AuthRepository, LoginResponseDto, User } from '@/domain'

import { NetService } from '../services/net/net.service'

@injectable()
export class AuthNetRepository extends NetService implements AuthRepository {
  constructor() {
    super()
  }

  async me(): Promise<NullableType<User>> {
    return this._send<NullableType<User>>({ path: 'auth/me', method: 'get' })
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

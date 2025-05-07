import { injectable } from 'inversify'
import { plainToClass } from 'class-transformer'

import type { NullableType } from '@/utils'
import type { AuthEmailLoginDto, AuthRegisterLoginDto, AuthRepository, LoginResponseDto } from '@/domain'

import { User } from '@/domain'

import { HttpClient } from '../adapters'

@injectable()
export class AuthNetRepository extends HttpClient implements AuthRepository {
  constructor() {
    super()
  }

  async me(): Promise<NullableType<User>> {
    const user = await this._send<NullableType<User>>({ path: 'auth/me' })
    return plainToClass(User, user)
  }

  async register(createUserDto: AuthRegisterLoginDto): Promise<void> {
    return this._send<void>({ path: 'auth/email/register', body: createUserDto, method: 'POST' })
  }

  async login(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    return this._send<LoginResponseDto>({ path: 'auth/email/login', body: loginDto, method: 'POST' })
  }

  async logout(): Promise<void> {
    return this._send<void>({ path: 'auth/logout', method: 'POST' })
  }
}

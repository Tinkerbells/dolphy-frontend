import { inject } from 'inversiland'
import { injectable } from 'inversify'

import type { HttpClientPort } from '@/core/domain/ports/http-client.port'
import type { AuthEmailLoginDto } from '@/auth/domain/dto/auth-email-login.dto'
import type { IAuthRepository } from '@/auth/domain/repositories/auth.repository'
import type { AuthRegisterLoginDto } from '@/auth/domain/dto/auth-register-login.dto'

import { User } from '@/auth/domain/user.domain'
import { LoginResponseDto } from '@/auth/domain/dto/login-response.dto'
import { HttpClientPortToken } from '@/core/domain/ports/http-client.port'

@injectable()
export class AuthRepository implements IAuthRepository {
  private readonly baseUrl = '/auth'
  constructor(
    @inject(HttpClientPortToken) private readonly http: HttpClientPort,
  ) {}

  async me(): Promise<User> {
    const json = await this.http.get<User>({ path: `${this.baseUrl}/me` })
    if (typeof json === 'object' && json !== null) {
      return new User().fromJSON(json)
    }
    throw new Error('Wrong return type')
  }

  async register(createUserDto: AuthRegisterLoginDto): Promise<void> {
    return this.http.post<void>({ path: `${this.baseUrl}/email/register`, body: createUserDto })
  }

  async login(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    const json = await this.http.post<LoginResponseDto>({ path: 'auth/email/login', body: loginDto })
    if (typeof json === 'object' && json !== null) {
      return new LoginResponseDto().fromJSON(json)
    }
    throw new Error('Wrong return type')
  }

  async logout(): Promise<void> {
    return this.http.post<void>({ path: 'auth/logout' })
  }
}

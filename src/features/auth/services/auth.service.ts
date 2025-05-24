import type { HttpClient } from '@/common'

import { http } from '@/common/services/http-client'

import type { AuthEmailLoginDto } from '../models/dto/auth-email-login.dto'
import type { AuthRepository } from '../models/repositories/auth.repository'
import type { AuthRegisterLoginDto } from '../models/dto/auth-register-login.dto'

import { User } from '../models/user.domain'
import { LoginResponseDto } from '../models/dto/login-response.dto'

class AuthService implements AuthRepository {
  private readonly baseUrl = 'auth'

  constructor(private readonly http: HttpClient) { }

  async me(): Promise<User> {
    const json = await this.http.get<User>({ path: `${this.baseUrl}/me` })
    if (typeof json === 'object' && json !== null) {
      return User.fromJSON(json)
    }
    throw new Error('Wrong return type')
  }

  async register(createUserDto: AuthRegisterLoginDto): Promise<void> {
    return this.http.post<void>({ path: `${this.baseUrl}/email/register`, body: createUserDto })
  }

  async login(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    const json = await this.http.post<LoginResponseDto>({ path: `${this.baseUrl}/email/login`, body: loginDto })
    if (typeof json === 'object' && json !== null) {
      return new LoginResponseDto().fromJSON(json)
    }
    throw new Error('Wrong return type')
  }

  async logout(): Promise<void> {
    return this.http.post<void>({ path: 'auth/logout' })
  }
}

export const authService = new AuthService(http)

import { plainToClass } from 'class-transformer'

import type { OperationResultDto } from '@/types'
import type { HttpClient } from '@/common/services/http-client'

import { http } from '@/common/services/http-client'

import type { AuthEmailLoginDto } from '../models/dto/auth-email-login.dto'
import type { AuthRepository } from '../models/repositories/auth.repository'
import type { AuthRegisterLoginDto } from '../models/dto/auth-register-login.dto'

import { User } from '../models/user.domain'
import { LoginResponseDto } from '../models/dto/login-response.dto'

class AuthService implements AuthRepository {
  private readonly baseUrl = 'auth'

  constructor(private readonly http: HttpClient) {}

  async me(signal?: AbortSignal): Promise<User> {
    const json = await this.http.get<User>({ path: `${this.baseUrl}/me`, signal })
    return plainToClass(User, json)
  }

  async register(createUserDto: AuthRegisterLoginDto, signal?: AbortSignal): Promise<OperationResultDto> {
    return this.http.post<OperationResultDto>({ path: `${this.baseUrl}/email/register`, body: createUserDto, signal })
  }

  async login(loginDto: AuthEmailLoginDto, signal?: AbortSignal): Promise<LoginResponseDto> {
    const json = await this.http.post<LoginResponseDto>({ path: `${this.baseUrl}/email/login`, body: loginDto, signal })
    return plainToClass(LoginResponseDto, json)
  }

  async logout(signal?: AbortSignal): Promise<void> {
    return this.http.post<void>({ path: 'auth/logout', signal })
  }
}

export const authService = new AuthService(http)

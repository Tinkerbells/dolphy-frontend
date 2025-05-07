import type { NullableType } from '@/types'

import type { User } from '../user.domain'
import type { LoginResponseDto } from '../dto/login-response.dto'
import type { AuthEmailLoginDto } from '../dto/auth-email-login.dto'
import type { AuthRegisterLoginDto } from '../dto/auth-register-login.dto'

export const IAuthRepositoryToken = Symbol()

export interface IAuthRepository {
  me: () => Promise<NullableType<User>>
  register: (createUserDto: AuthRegisterLoginDto) => Promise<void>
  login: (loginDto: AuthEmailLoginDto) => Promise<LoginResponseDto>
  logout: () => Promise<void>
}

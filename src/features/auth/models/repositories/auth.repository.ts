import type { NullableType, OperationResultDto } from '@/types'

import type { User } from '../user.domain'
import type { LoginResponseDto } from '../dto/login-response.dto'
import type { AuthEmailLoginDto } from '../dto/auth-email-login.dto'
import type { AuthRegisterLoginDto } from '../dto/auth-register-login.dto'

export interface AuthRepository {
  me: (signal?: AbortSignal) => Promise<NullableType<User>>
  register: (createUserDto: AuthRegisterLoginDto, signal?: AbortSignal) => Promise<OperationResultDto>
  login: (loginDto: AuthEmailLoginDto, signal?: AbortSignal) => Promise<LoginResponseDto>
  logout: (signal?: AbortSignal) => Promise<void>
}

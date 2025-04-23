import type { LoginResponseDto } from '@/domain/auth/dto/login-response.dto'
import type { AuthEmailLoginDto } from '@/domain/auth/dto/auth-email-login.dto'
import type { AuthRepository } from '@/domain/auth/repositories/auth.repository'
import type { AuthRegisterLoginDto } from '@/domain/auth/dto/auth-register-login.dto'

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async register(createUserDto: AuthRegisterLoginDto): Promise<void> {
    return await this.authRepository.register(createUserDto)
  }

  async login(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    return await this.authRepository.login(loginDto)
  }

  async logout(): Promise<void> {
    return await this.authRepository.logout()
  }
}

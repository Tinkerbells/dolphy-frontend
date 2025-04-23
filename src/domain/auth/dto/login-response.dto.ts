import type { User } from '@/domain/user/user.domain'

export class LoginResponseDto {
  token: string
  refreshToken: string
  tokenExpires: number
  user: User
}

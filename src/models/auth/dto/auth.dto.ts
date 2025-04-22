import type { User } from '../domain/user.domain'

export interface LoginResponseDto {
  token: string
  refreshToken: string
  tokenExpires: number
  user: User
}

import type { User } from '../user.domain'

export class LoginResponseDto {
  token: string
  refreshToken: string
  tokenExpires: number
  user: User
}

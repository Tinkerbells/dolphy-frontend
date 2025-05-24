import { jsonProperty, Serializable } from 'ts-serializable'

import { User } from '../user.domain'

export class LoginResponseDto extends Serializable {
  @jsonProperty(String)
  token: string

  @jsonProperty(String)
  refreshToken: string

  @jsonProperty(Number)
  tokenExpires: number

  @jsonProperty(User)
  user: User = new User()
}

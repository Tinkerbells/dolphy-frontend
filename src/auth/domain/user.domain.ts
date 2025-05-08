import { jsonIgnore, jsonProperty, Serializable } from 'ts-serializable'

export class User extends Serializable {
  @jsonProperty(Number, String)
  id: number | string

  @jsonProperty(String, null)
  email: string | null

  @jsonProperty(String)
  provider: string

  @jsonProperty(String, null)
  socialId?: string | null

  @jsonProperty(String, null)
  firstName: string | null

  @jsonProperty(String, null)
  lastName: string | null

  // TODO fix any typings
  photo?: any | null

  @jsonIgnore()
  role?: any | null

  @jsonIgnore()
  status?: any | null

  @jsonProperty(String)
  createdAt: string

  @jsonProperty(String)
  updatedAt: string

  @jsonProperty(String, null)
  deletedAt: string

  @jsonIgnore()
  get fullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ')
  }

  @jsonIgnore()
  get firstChar(): string {
    return this.firstName?.charAt(0) || 'U'
  }
}

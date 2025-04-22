export interface UserDto {
  id: UniqueId
  email: string
  firstName?: string
  lastName?: string
  created: DateTimeString
  lastLogin?: DateTimeString
  isActive: boolean
}

export class User implements UserDto {
  id: UniqueId
  email: string
  firstName?: string
  lastName?: string
  created: DateTimeString
  lastLogin?: DateTimeString
  isActive: boolean

  constructor(userDto: UserDto) {
    this.id = userDto.id
    this.email = userDto.email
    this.firstName = userDto.firstName
    this.lastName = userDto.lastName
    this.created = userDto.created
    this.lastLogin = userDto.lastLogin
    this.isActive = userDto.isActive
  }

  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`
    }
    if (this.firstName) {
      return this.firstName
    }
    if (this.lastName) {
      return this.lastName
    }
    return this.email.split('@')[0]
  }

  toDto(): UserDto {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      created: this.created,
      lastLogin: this.lastLogin,
      isActive: this.isActive,
    }
  }
}

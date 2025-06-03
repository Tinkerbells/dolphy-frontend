export class User {
  id: number | string
  email: string
  provider: string
  socialId?: string
  firstName: string
  lastName: string
  // TODO: fix any typings
  photo?: any
  role?: any
  status?: any
  createdAt: string
  updatedAt: string
  deletedAt: string
  get fullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ')
  }

  get firstChar(): string {
    return this.firstName?.charAt(0) || 'U'
  }
}

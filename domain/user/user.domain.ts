export class User {
  id: number | string
  email: string | null
  provider: string
  socialId?: string | null
  firstName: string | null
  lastName: string | null
  // TODO fix any typings
  photo?: any | null
  role?: any | null
  status?: any | null
  createdAt: string
  updatedAt: string
  deletedAt: string

  get fullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ')
  }

  get firstChar(): string {
    return this.firstName?.charAt(0) || 'U'
  }

  // Example: Parse createdAt to Date object
  get createdDate(): Date {
    return new Date(this.createdAt)
  }
}

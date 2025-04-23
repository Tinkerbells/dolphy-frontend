export class User {
  id: number | string
  email: string | null
  provider: string
  socialId?: string | null
  firstName: string | null
  lastName: string | null
  // TODO fix any typeings
  photo?: any | null
  role?: any | null
  status?: any | null
  createdAt: string
  updatedAt: string
  deletedAt: string

  constructor(data: Partial<User>) {
    this.id = data.id!
    this.email = data.email ?? null
    this.provider = data.provider!
    this.socialId = data.socialId ?? null
    this.firstName = data.firstName ?? null
    this.lastName = data.lastName ?? null
    this.photo = data.photo ?? null
    this.role = data.role ?? null
    this.status = data.status ?? null
    this.createdAt = data.createdAt!
    this.updatedAt = data.updatedAt!
    this.deletedAt = data.deletedAt!
  }

  get fullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ')
  }

  // Example: Parse createdAt to Date object
  get createdDate(): Date {
    return new Date(this.createdAt)
  }
}

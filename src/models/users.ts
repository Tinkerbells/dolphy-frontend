export interface UserDto {
  id: UniqueId
  name: string
  telegramId?: string
  created: DateTimeString
  lastActive: DateTimeString
  preferences: {
    theme: 'light' | 'dark' | 'system'
    cardsPerSession: number
    newCardsPerDay: number
    reviewsPerDay: number
  }
}

export class Users {
  users: UserDto[] = []

  constructor(users: UserDto[] = []) {
    this.users = users
  }

  setUsers(users: UserDto[]) {
    this.users = users
  }

  getUserById(userId: string): UserDto | undefined {
    return this.users.find(user => user.id === userId)
  }

  getUserByTelegramId(telegramId: string): UserDto | undefined {
    return this.users.find(user => user.telegramId === telegramId)
  }

  updateLastActive(userId: string): void {
    const user = this.getUserById(userId)
    if (user) {
      user.lastActive = new Date().toISOString()
    }
  }

  updatePreferences(userId: string, preferences: Partial<UserDto['preferences']>): boolean {
    const user = this.getUserById(userId)
    if (user) {
      user.preferences = {
        ...user.preferences,
        ...preferences,
      }
      return true
    }
    return false
  }
}

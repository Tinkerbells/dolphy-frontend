import { inject, injectable } from 'inversify'

import type { TelegramService } from './telegram-service'
import type { StudyPreferences, User } from '../domain/user'
import type { UserRepository } from '../repositories/user-repository'

import { SYMBOLS } from '../di/symbols'
import { createUser, updateUserPreferences } from '../domain/user'

@injectable()
export class UserService {
  constructor(
    @inject(SYMBOLS.UserRepository) private userRepository: UserRepository,
    @inject(SYMBOLS.TelegramService) private telegramService: TelegramService,
  ) {}

  async getCurrentUser(): Promise<User | undefined> {
    // Try to get user from repository
    const telegramId = this.telegramService.getUserId()
    let user = await this.userRepository.getById(telegramId)

    // If no user exists, create one
    if (!user) {
      const userName = this.telegramService.getUserName()
      user = createUser(telegramId, userName)
      await this.userRepository.create(user)
    }

    return user
  }

  async updateUserPreferences(userId: string, preferences: Partial<StudyPreferences>): Promise<User | undefined> {
    const user = await this.userRepository.getById(userId)
    if (!user) {
      return undefined
    }

    const updatedUser = updateUserPreferences(user, preferences)
    await this.userRepository.update(updatedUser)
    return updatedUser
  }
}

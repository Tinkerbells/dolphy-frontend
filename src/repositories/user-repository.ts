import { inject, injectable } from 'inversify'

import type { User } from '../domain/user'
import type { StorageAdapter } from './storage-adapter'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class UserRepository {
  constructor(
    @inject(SYMBOLS.StorageAdapter) private storage: StorageAdapter,
  ) {}

  async getById(id: string): Promise<User | undefined> {
    return this.storage.getUser()
  }

  async create(user: User): Promise<void> {
    await this.storage.setUser(user)
  }

  async update(user: User): Promise<void> {
    await this.storage.setUser(user)
  }
}

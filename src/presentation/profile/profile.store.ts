import type { MobxQueryClient } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversify'
import { MobxQuery } from 'mobx-tanstack-query'

import type { User } from '@/domain'
import type { NullableType } from '@/utils'
import type { Profile } from '@/application/profile'

import { Symbols } from '@/di'

/**
 * Хранилище данных о текущем пользователе
 */
@injectable()
export class ProfileStore {
  /** Данные текущего пользователя */

  isProfileLoading: boolean = true

  private profileKey: string = 'profile'

  currentUser: User | null = null

  private getProfile: MobxQuery<NullableType<User>, Error> = new MobxQuery({ queryClient: this.queryClient, queryKey: [this.profileKey], queryFn: async () => {
    return await this.profile.get()
  }, onDone: (data) => {
    this.setUser(data)
    this.isProfileLoading = false
  } })

  constructor(
    @inject(Symbols.Profile) private profile: Profile,
    @inject(Symbols.QueryClient) private queryClient: MobxQueryClient,
  ) {
    makeAutoObservable(this)
  }

  public get user() {
    return this.currentUser
  }

  private setUser(user: User | null) {
    this.currentUser = user
  }
}

import type { MobxQueryClient } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversify'
import { MobxMutation, MobxQuery } from 'mobx-tanstack-query'

import type { User } from '@/domain'
import type { NullableType } from '@/utils'
import type { Authenticate } from '@/application'
import type { Profile } from '@/application/profile'

import { Symbols } from '@/di'

/**
 * Хранилище данных о текущем пользователе
 */
@injectable()
export class ProfileStore {
  /** Данные текущего пользователя */

  private profileKey: string = 'profile'

  public profile: MobxQuery<NullableType<User>, Error> = new MobxQuery({ queryClient: this.queryClient, queryKey: [this.profileKey], queryFn: async () => {
    return await this.profileService.get()
  } })

  public logout: MobxMutation<void, void, Error> = new MobxMutation({ queryClient: this.queryClient, mutationFn: () => this.authenticate.logout() })

  constructor(
    @inject(Symbols.Profile) private profileService: Profile,
    @inject(Symbols.AuthServiceSymbol) private authenticate: Authenticate,
    @inject(Symbols.QueryClient) private queryClient: MobxQueryClient,
  ) {
    makeAutoObservable(this)
  }
}

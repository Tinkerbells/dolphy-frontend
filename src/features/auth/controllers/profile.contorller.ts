import { makeAutoObservable } from 'mobx'

import type { NullableType } from '@/types'
import type { NetError } from '@/common/services/http-client'
import type { CacheService, PersistStorage, RouterService } from '@/common'

import { root } from '@/app/navigation/routes'
import { cacheInstance, localStorageInstance, router } from '@/common'

import type { User } from '../models/user.domain'
import type { AuthRepository } from '../models/repositories/auth.repository'

import { authService } from '../services/auth.service'

class ProfileController {
  private readonly keys = {
    profile: ['profile'] as const,
  }

  private readonly ACCESS_TOKEN = 'access_token'
  private readonly REFRESH_TOKEN = 'refresh_token'
  constructor(
    private readonly cache: CacheService,
    private readonly persistStorage: PersistStorage,
    private readonly router: RouterService,
    private readonly authService: AuthRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isLoading() {
    return this.getProfileQuery.result.isLoading
  }

  public get user() {
    return this.getProfileQuery.result.data
  }

  public refetch() {
    return this.getProfileQuery.refetch()
  }

  public async logout() {
    return await this.logoutMutation.mutate()
  }

  private readonly getProfileQuery
    = this.cache.createQuery<NullableType<User>, NetError>(
      () => this.authService.me(),
      {
        queryKey: this.keys.profile,
        enableOnDemand: true,
      },
    )

  private readonly logoutMutation = this.cache.createMutation(
    (_, { signal }) => this.authService.logout(signal),
    {
      onError: () => {},
      onSuccess: () => {
        this.persistStorage.remove(this.ACCESS_TOKEN)
        this.persistStorage.remove(this.REFRESH_TOKEN)
        // Очищаем весь кэш
        this.cache.getClient().clear()
        this.router.navigate(root['sign-in'].$path(), { replace: true })
      },
    },
  )
}

export const profile = new ProfileController(cacheInstance, localStorageInstance, router, authService)

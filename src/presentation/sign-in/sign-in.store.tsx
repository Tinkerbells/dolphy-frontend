import type { MobxQueryClient } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversify'
import { MobxMutation } from 'mobx-tanstack-query'

import type { AuthService } from '@/application/services/auth.service'
import type { LoginResponseDto } from '@/domain/auth/dto/login-response.dto'
import type { AuthEmailLoginDto } from '@/domain/auth/dto/auth-email-login.dto'

import { SYMBOLS } from '@/di/symbols'
import { localStorage } from '@/utils/local-storage'

@injectable()
export class SignInStore {
  private readonly queryClient: MobxQueryClient
  login: MobxMutation<LoginResponseDto, AuthEmailLoginDto, Error>

  constructor(
    private authService: AuthService,
    @inject(SYMBOLS.QueryClient) queryClient: MobxQueryClient,
  ) {
    makeAutoObservable(this)
    this.queryClient = queryClient
    this.login = new MobxMutation({
      queryClient: this.queryClient,
      mutationFn: dto => this.authService.login(dto),
      onSuccess: (data) => {
        localStorage.setPrimitive('access_token', data.token)
        localStorage.setPrimitive('refresh_token', data.refreshToken)
      },
    })
  }
}

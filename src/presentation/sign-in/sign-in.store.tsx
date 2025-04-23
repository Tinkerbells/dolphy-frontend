import { makeAutoObservable } from 'mobx'

import type { AuthService } from '@/application/services/auth.service'
import type { AuthEmailLoginDto } from '@/domain/auth/dto/auth-email-login.dto'
import { MobxQuery } from 'mobx-tanstack-query'

export class SignInStore {
  loginQuery: MobxQuery<
  constructor(private authService: AuthService) {
    makeAutoObservable(this)
  }

  async login(loginDto: AuthEmailLoginDto) {
    this.authService.login(loginDto)
  }
}

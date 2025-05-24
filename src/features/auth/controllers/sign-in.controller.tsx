import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { CacheService, Notify, PersistStorage } from '@/common'
import type { NetError } from '@/common/services/http-client/net-error'

import { cacheInstance } from '@/common/services/cache'
import { localStorageInstance, notify } from '@/common'

import type { LoginResponseDto } from '../models/dto/login-response.dto'
import type { AuthRepository } from '../models/repositories/auth.repository'

import { authService } from '../services/auth.service'
import { AuthEmailLoginDto } from '../models/dto/auth-email-login.dto'

export class SignInStore {
  private readonly ACCESS_TOKEN = 'access_token'
  private readonly REFRESH_TOKEN = 'refresh_token'

  signInForm: MobxForm<AuthEmailLoginDto>

  constructor(
    private readonly cache: CacheService,
    private readonly persistStorage: PersistStorage,
    private readonly notify: Notify,
    private readonly authService: AuthRepository,

  ) {
    this.signInForm = new MobxForm<AuthEmailLoginDto>({
      defaultValues: {
        email: '',
        password: '',
      },
      resolver: classValidatorResolver(AuthEmailLoginDto),
      mode: 'onChange',
      // onSubmit: this.login(),
    })

    makeAutoObservable(this)
  }

  public login() {
    return this.cache.createMutation<LoginResponseDto, AuthEmailLoginDto, NetError>(
      dto => this.authService.login(dto),
      {
        onSuccess: (data) => {
          // Сохраняем токены после успешного входа
          this.persistStorage.setPrimitive(this.ACCESS_TOKEN, data.token)
          this.persistStorage.setPrimitive(this.REFRESH_TOKEN, data.refreshToken)
        },
        onError: () => {
          // Обрабатываем ошибки формы
          // handleFormErrors(this.signInForm, error, this.notify, {
          //   focusFirstError: true,
          // })
        },
      },
    )
  }
}

export const signInController = new SignInStore(cacheInstance, localStorageInstance, notify, authService)

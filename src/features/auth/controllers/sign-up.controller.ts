import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { OperationResultDto } from '@/types'
import type { CacheService, Notify } from '@/common'
import type { NetError } from '@/common/services/http-client/net-error'

import { handleFormErrors, notify } from '@/common'
import { cacheInstance } from '@/common/services/cache'

import type { AuthRepository } from '../models/repositories/auth.repository'

import { authService } from '../services/auth.service'
import { AuthRegisterLoginDto } from '../models/dto/auth-register-login.dto'

class SignUpStore {
  signUpForm: MobxForm<AuthRegisterLoginDto>
  constructor(
    private readonly cache: CacheService,
    private readonly notify: Notify,
    private readonly authService: AuthRepository,
  ) {
    this.signUpForm = new MobxForm<AuthRegisterLoginDto>({
      defaultValues: {
        email: '',
        password: '',
      },
      resolver: classValidatorResolver(AuthRegisterLoginDto),
      mode: 'onChange',
      onSubmit: this.register,
    })

    makeAutoObservable(this)
  }

  private register = async (data: AuthRegisterLoginDto) => {
    await this.registerMutation.mutate(data)
  }

  public get isLoading() {
    return this.registerMutation.result.isPending
  }

  private readonly registerMutation = this.cache.createMutation<OperationResultDto, AuthRegisterLoginDto, NetError>(
    dto => this.authService.register(dto),
    {
      onSuccess: ({ message }) => {
        this.signUpForm.reset()
        this.notify.success(message)
      },
      onError: (error) => {
        handleFormErrors(this.signUpForm, error, this.notify, {
          focusFirstError: true,
        })
      },
    },
  )
}

export const signUpController = new SignUpStore(cacheInstance, notify, authService)

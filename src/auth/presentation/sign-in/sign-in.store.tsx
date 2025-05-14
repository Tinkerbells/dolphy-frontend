import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { inject, injectable } from 'inversiland'
import { MobxMutation } from 'mobx-tanstack-query'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { NotifyPort } from '@/core/domain/ports/notify.port'
import type { NetError } from '@/core/infrastructure/models/net-error'
import type { LoginResponseDto } from '@/auth/domain/dto/login-response.dto'
import type { PersistStoragePort } from '@/core/domain/ports/persist-storage.port'

import { queryClient } from '@/core/presentation/react'
import { handleFormErrors } from '@/core/presentation/ui'
import { NotifyPortToken } from '@/core/domain/ports/notify.port'
import { SignInUseCase } from '@/auth/application/sign-in.use-case'
import { AuthEmailLoginDto } from '@/auth/domain/dto/auth-email-login.dto'
import { PersistStoragePortToken } from '@/core/domain/ports/persist-storage.port'

@injectable()
export class SignInStore {
  private readonly ACCESS_TOKEN = 'access_token'
  private readonly REFRESH_TOKEN = 'refresh_token'
  login: MobxMutation<LoginResponseDto, AuthEmailLoginDto, NetError> = new MobxMutation({
    queryClient,
    mutationFn: dto => this.signIn.execute(dto),
    onSuccess: (data) => {
      this.persistStorage.setPrimitive(this.ACCESS_TOKEN, data.token)
      this.persistStorage.setPrimitive(this.REFRESH_TOKEN, data.refreshToken)
    },
    onError: (error) => {
      handleFormErrors(this.signInForm, error, this.notify, {
        focusFirstError: true,
      })
    },
  })

  signInForm: MobxForm<AuthEmailLoginDto>

  constructor(
    @inject(SignInUseCase) private signIn: SignInUseCase,
    @inject(PersistStoragePortToken) private persistStorage: PersistStoragePort,
    @inject(NotifyPortToken) private notify: NotifyPort,
  ) {
    this.signInForm = new MobxForm<AuthEmailLoginDto>({
      defaultValues: {
        email: '',
        password: '',
      },
      resolver: classValidatorResolver(AuthEmailLoginDto),
      mode: 'onChange',
      onSubmit: this.handleSignIn,
    })

    makeAutoObservable(this)
  }

  handleSignIn = async (data: AuthEmailLoginDto) => {
    await this.login.mutate(data)
  }
}

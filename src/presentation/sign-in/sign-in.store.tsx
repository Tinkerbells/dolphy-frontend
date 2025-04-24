import type { MobxQueryClient } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversify'
import { MobxForm } from 'mobx-react-hook-form'
import { MobxMutation } from 'mobx-tanstack-query'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { Authenticate } from '@/application/auth/authenticate'
import type { LoginResponseDto } from '@/domain/auth/dto/login-response.dto'

import { localStorage } from '@/utils/local-storage'
import { AuthSymbols, QueryClientSymbols } from '@/di/modules'
import { AuthEmailLoginDto } from '@/domain/auth/dto/auth-email-login.dto'

@injectable()
export class SignInStore {
  login: MobxMutation<LoginResponseDto | undefined, AuthEmailLoginDto, Error>

  signInForm: MobxForm<AuthEmailLoginDto>

  showPassword = false

  constructor(
    @inject(AuthSymbols.Authenticate) private authenticate: Authenticate,
    @inject(QueryClientSymbols.QueryClient) private queryClient: MobxQueryClient,
  ) {
    // Инициализация мутации входа
    this.login = new MobxMutation({
      queryClient: this.queryClient,
      mutationFn: dto => this.authenticate.login(dto),
      onSuccess: (data) => {
        if (data) {
          localStorage.setPrimitive('access_token', data.token)
          localStorage.setPrimitive('refresh_token', data.refreshToken)
        }
      },
    })

    // Инициализация формы с использованием MobxForm
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
    try {
      await this.login.mutate(data)
    }
    catch (error) {
      console.error('Login failed:', error)
    }
  }

  togglePasswordVisibility = () => {
    this.showPassword = !this.showPassword
  }
}

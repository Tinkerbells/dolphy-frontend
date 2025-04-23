import type { MobxQueryClient } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { Injectable } from '@wox-team/wox-inject'
import { MobxMutation } from 'mobx-tanstack-query'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { AuthService } from '@/application/services/auth.service'
import type { LoginResponseDto } from '@/domain/auth/dto/login-response.dto'

import { localStorage } from '@/utils/local-storage'
import { AuthEmailLoginDto } from '@/domain/auth/dto/auth-email-login.dto'

@Injectable()
export class SignInStore {
  login: MobxMutation<LoginResponseDto, AuthEmailLoginDto, Error>

  signInForm: MobxForm<AuthEmailLoginDto>

  showPassword = false

  constructor(
    private authService: AuthService,
    private queryClient: MobxQueryClient,
  ) {
    // Инициализация мутации входа
    this.login = new MobxMutation({
      queryClient: this.queryClient,
      mutationFn: dto => this.authService.login(dto),
      onSuccess: (data) => {
        localStorage.setPrimitive('access_token', data.token)
        localStorage.setPrimitive('refresh_token', data.refreshToken)
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

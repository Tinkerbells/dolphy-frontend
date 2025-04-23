import type { MobxQueryClient } from 'mobx-tanstack-query'

import { z } from 'zod'
import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversify'
import { MobxForm } from 'mobx-react-hook-form'
import { MobxMutation } from 'mobx-tanstack-query'
import { zodResolver } from '@hookform/resolvers/zod'

import type { AuthService } from '@/application/services/auth.service'
import type { LoginResponseDto } from '@/domain/auth/dto/login-response.dto'
import type { AuthEmailLoginDto } from '@/domain/auth/dto/auth-email-login.dto'

import { SYMBOLS } from '@/di/symbols'
import { localStorage } from '@/utils/local-storage'

// Схема валидации для формы входа
const signInSchema = z.object({
  email: z.string().email('Введите корректный email адрес'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

@injectable()
export class SignInStore {
  private readonly queryClient: MobxQueryClient
  login: MobxMutation<LoginResponseDto, AuthEmailLoginDto, Error>

  signInForm: MobxForm<AuthEmailLoginDto>

  showPassword = false

  constructor(
    private authService: AuthService,
    @inject(SYMBOLS.QueryClient) queryClient: MobxQueryClient,
  ) {
    makeAutoObservable(this)

    this.queryClient = queryClient

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
      resolver: zodResolver(signInSchema),
      mode: 'onChange',
      onSubmit: this.handleSignIn,
    })
  }

  handleSignIn = async (data: AuthEmailLoginDto) => {
    const { mutate } = this.login
    mutate(data)
  }

  togglePasswordVisibility = () => {
    this.showPassword = !this.showPassword
  }
}

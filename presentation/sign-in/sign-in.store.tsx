import type { MobxQueryClient } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversify'
import { MobxForm } from 'mobx-react-hook-form'
import { MobxMutation } from 'mobx-tanstack-query'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { LoginResponseDto } from '@/domain'
import type { AuthService } from '@/application'

import { Symbols } from '@/di'
import { AuthEmailLoginDto } from '@/domain/auth/dto/auth-email-login.dto'

@injectable()
export class SignInStore {
  login: MobxMutation<LoginResponseDto | undefined, AuthEmailLoginDto, Error> = new MobxMutation({
    queryClient: this.queryClient,
    mutationFn: dto => this.authService.login(dto),
  })

  signInForm: MobxForm<AuthEmailLoginDto>

  showPassword = false

  constructor(
    @inject(Symbols.AuthServiceSymbol) private authService: AuthService,
    @inject(Symbols.QueryClient) private queryClient: MobxQueryClient,
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

import type { MobxQueryClient } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversify'
import { MobxForm } from 'mobx-react-hook-form'
import { MobxMutation } from 'mobx-tanstack-query'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { Authenticate } from '@/application'

import { Symbols } from '@/di'
import { AuthRegisterLoginDto } from '@/domain'

@injectable()
export class SignUpStore {
  register: MobxMutation<void, AuthRegisterLoginDto, Error> = new MobxMutation({
    queryClient: this.queryClient,
    mutationFn: dto => this.authService.register(dto),
  })

  signUpForm: MobxForm<AuthRegisterLoginDto>

  showPassword = false

  constructor(
    @inject(Symbols.Authenticate) private authService: Authenticate,
    @inject(Symbols.QueryClient) private queryClient: MobxQueryClient,
  ) {
    this.signUpForm = new MobxForm<AuthRegisterLoginDto>({
      defaultValues: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      },
      resolver: classValidatorResolver(AuthRegisterLoginDto),
      mode: 'onChange',
      onSubmit: this.handleSignUp,
    })

    makeAutoObservable(this)
  }

  handleSignUp = async (data: AuthRegisterLoginDto) => {
    try {
      await this.register.mutate(data)
    }
    catch (error) {
      console.error('Registration failed:', error)
    }
  }

  togglePasswordVisibility = () => {
    this.showPassword = !this.showPassword
  }
}

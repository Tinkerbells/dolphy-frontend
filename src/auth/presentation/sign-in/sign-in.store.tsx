import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { inject, injectable } from 'inversiland'
import { MobxMutation } from 'mobx-tanstack-query'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { LoginResponseDto } from '@/auth/domain/dto/login-response.dto'

import { queryClient } from '@/core/presentation/react'
import { SignInUseCase } from '@/auth/application/sign-in.use-case'
import { AuthEmailLoginDto } from '@/auth/domain/dto/auth-email-login.dto'

export const SignInStoreToken = Symbol()

@injectable()
export class SignInStore {
  login: MobxMutation<LoginResponseDto, AuthEmailLoginDto, Error> = new MobxMutation({
    queryClient,
    mutationFn: dto => this.signIn.execute(dto),
  })

  signInForm: MobxForm<AuthEmailLoginDto>

  constructor(
    @inject(SignInUseCase) private signIn: SignInUseCase,
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

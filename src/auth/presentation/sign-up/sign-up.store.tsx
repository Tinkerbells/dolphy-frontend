import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { inject, injectable } from 'inversiland'
import { MobxMutation } from 'mobx-tanstack-query'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import { queryClient } from '@/core/presentation/react'
import { SignUpUseCase } from '@/auth/application/sign-up.use-case'
import { AuthRegisterLoginDto } from '@/auth/domain/dto/auth-register-login.dto'

@injectable()
export class SignUpStore {
  register: MobxMutation<void, AuthRegisterLoginDto, Error> = new MobxMutation({
    queryClient,
    mutationFn: dto => this.signUp.execute(dto),
  })

  signUpForm: MobxForm<AuthRegisterLoginDto>

  constructor(
    @inject(SignUpUseCase) private signUp: SignUpUseCase,
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
    await this.register.mutate(data)
  }
}

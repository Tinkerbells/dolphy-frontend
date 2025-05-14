import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { inject, injectable } from 'inversiland'
import { MobxMutation } from 'mobx-tanstack-query'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { NotifyPort } from '@/core/domain/ports/notify.port'
import type { NetError } from '@/core/infrastructure/models/net-error'

import { queryClient } from '@/core/presentation/react'
import { handleFormErrors } from '@/core/presentation/ui'
import { NotifyPortToken } from '@/core/domain/ports/notify.port'
import { SignUpUseCase } from '@/auth/application/sign-up.use-case'
import { AuthRegisterLoginDto } from '@/auth/domain/dto/auth-register-login.dto'

@injectable()
export class SignUpStore {
  register: MobxMutation<void, AuthRegisterLoginDto, NetError> = new MobxMutation({
    queryClient,
    mutationFn: dto => this.signUp.execute(dto),
    onError: (error) => {
      handleFormErrors(this.signUpForm, error, this.notify, {
        focusFirstError: true,
      })
    },
  })

  signUpForm: MobxForm<AuthRegisterLoginDto>

  constructor(
    @inject(SignUpUseCase) private signUp: SignUpUseCase,
    @inject(NotifyPortToken) private notify: NotifyPort,
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

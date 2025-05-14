import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { inject, injectable } from 'inversiland'
import { MobxMutation } from 'mobx-tanstack-query'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { NotifyPort } from '@/core/domain/ports/notify.port'
import type { NetError } from '@/core/infrastructure/models/net-error'

import { queryClient } from '@/core/presentation/react'
import { NotifyPortToken } from '@/core/domain/ports/notify.port'
import { SignUpUseCase } from '@/auth/application/sign-up.use-case'
import { AuthRegisterLoginDto } from '@/auth/domain/dto/auth-register-login.dto'

@injectable()
export class SignUpStore {
  register: MobxMutation<void, AuthRegisterLoginDto, NetError> = new MobxMutation({
    queryClient,
    mutationFn: dto => this.signUp.execute(dto),
    onError: (error) => {
      // Исправленный способ установки ошибки
      if (error.validationErrors?.email) {
        this.signUpForm.setError('email', {
          message: error.validationErrors.email,
        })
      }
      else if (error.message) {
        this.notify.error(error.message)
      }
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

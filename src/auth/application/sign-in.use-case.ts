import { inject, injectable } from 'inversiland'

import type { AuthEmailLoginDto } from '../domain/dto/auth-email-login.dto'
import type { IAuthRepository } from '../domain/repositories/auth.repository'

import { IAuthRepositoryToken } from '../domain/repositories/auth.repository'

@injectable()
export class SignInUseCase {
  constructor(
    @inject(IAuthRepositoryToken)
    private readonly authRepository: IAuthRepository,
  ) {}

  public execute(data: AuthEmailLoginDto) {
    return this.authRepository.login(data)
  }
}

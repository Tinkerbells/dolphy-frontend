import { inject, injectable } from 'inversiland'

import type { IAuthRepository } from '../domain/repositories/auth.repository'
import type { AuthRegisterLoginDto } from '../domain/dto/auth-register-login.dto'

import { IAuthRepositoryToken } from '../domain/repositories/auth.repository'

@injectable()
export class SignUpUseCase {
  constructor(
    @inject(IAuthRepositoryToken)
    private readonly authRepository: IAuthRepository,
  ) {}

  public execute(data: AuthRegisterLoginDto) {
    return this.authRepository.register(data)
  }
}

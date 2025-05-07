import { inject, injectable } from 'inversiland'

import type { IAuthRepository } from '../domain/repositories/auth.repository'

import { IAuthRepositoryToken } from '../domain/repositories/auth.repository'

@injectable()
export class GetProfileUseCase {
  constructor(
    @inject(IAuthRepositoryToken)
    private readonly authRepository: IAuthRepository,
  ) {}

  public execute() {
    return this.authRepository.me()
  }
}

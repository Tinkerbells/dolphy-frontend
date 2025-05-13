import { module } from 'inversiland'

import { SignInUseCase } from './application/sign-in.use-case'
import { SignUpUseCase } from './application/sign-up.use-case'
import { SignUpStore } from './presentation/sign-up/sign-up.store'
import { SignInStore } from './presentation/sign-in/sign-in.store'
import { AuthRepository } from './infrastructure/adapters/auth.repository'
import { IAuthRepositoryToken } from './domain/repositories/auth.repository'

@module({
  providers: [
    {
      provide: IAuthRepositoryToken,
      useClass: AuthRepository,
    },
    SignInUseCase,
    SignUpUseCase,
    {
      isGlobal: true,
      useClass: SignInStore,
    },
    SignUpStore,
  ],
})
export class AuthModule {}

import { ContainerModule } from 'inversify'

import type { AuthRepository } from '@/domain/auth/repositories/auth.repository'

import { Authenticate } from '@/application/auth/authenticate'
import { SignInStore } from '@/presentation/sign-in/sign-in.store'
import { SignUpStore } from '@/presentation/sign-up/sign-up.store'
import { AuthNetRepository } from '@/infrastructure/repositories/auth.repository'

import { Symbols } from '../symbols'

export const authModule = new ContainerModule((options) => {
  options.bind<AuthRepository>(Symbols.AuthRepository).to(AuthNetRepository).inSingletonScope()
  options.bind(Symbols.Authenticate).to(Authenticate).inSingletonScope()
  options.bind(Symbols.SignInStore).to(SignInStore).inSingletonScope()
  options.bind(Symbols.SignUpStore).to(SignUpStore).inSingletonScope()
})

import { ContainerModule } from 'inversify'

import type { AuthRepository } from '@/domain/auth/repositories/auth.repository'

import { Authenticate } from '@/application/auth/authenticate'
import { SignInStore } from '@/presentation/sign-in/sign-in.store'
import { SignUpStore } from '@/presentation/sign-up/sign-up.store'
import { AuthNetRepository } from '@/infrastructure/repositories/auth.repository'

import { AuthSymbols } from './auth.symbol'

export const authModule = new ContainerModule((options) => {
  options.bind<AuthRepository>(AuthSymbols.AuthRepository).to(AuthNetRepository).inSingletonScope()
  options.bind(AuthSymbols.Authenticate).to(Authenticate).inSingletonScope()
  options.bind(AuthSymbols.SignInStore).to(SignInStore).inSingletonScope()
  options.bind(AuthSymbols.SignUpStore).to(SignUpStore).inSingletonScope()
})

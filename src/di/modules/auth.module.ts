import { ContainerModule } from 'inversify'

import { Authenticate } from '@/application/auth/authenticate'
import { AuthNetRepository } from '@/infrastructure/repositories/auth.repository'

import { SYMBOLS } from '../symbols'

export const authModule = new ContainerModule((options) => {
  options.bind(SYMBOLS.AuthRepository).to(AuthNetRepository)
  options.bind(SYMBOLS.AuthService).to(Authenticate)
})

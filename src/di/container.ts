import 'reflect-metadata'

import type { MobxQueryClient } from 'mobx-tanstack-query'

import { Container } from 'inversify'

import type { AuthRepository } from '@/domain/auth/repositories/auth.repository'

import { mobxQueryClient } from '@/lib/mobx-query'
import { AuthService } from '@/application/services/auth.service'
import { SignInStore } from '@/presentation/sign-in/sign-in.store'
import { AuthNetRepository } from '@/infrastructure/repositories/auth.repository'

import { SYMBOLS } from './symbols'

const container = new Container()

container.bind<MobxQueryClient>(SYMBOLS.QueryClient).toConstantValue(mobxQueryClient)

container.bind<AuthRepository>(SYMBOLS.AuthRepository).to(AuthNetRepository).inSingletonScope()

container.bind<AuthService>(SYMBOLS.AuthService).to(AuthService).inSingletonScope()

container.bind<SignInStore>(SYMBOLS.SignInStore).to(SignInStore).inSingletonScope()

export { container }

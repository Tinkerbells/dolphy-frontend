import 'reflect-metadata'

import type { MobxQueryClient } from 'mobx-tanstack-query'

import { Container } from 'inversify'

import type { AuthRepository } from '@/domain/auth/repositories/auth.repository'

import { mobxQueryClient } from '@/lib/mobx-query'
import { UserStore } from '@/presentation/user/user.store'
import { AuthService } from '@/application/services/auth.service'
import { SignInStore } from '@/presentation/sign-in/sign-in.store'
import { SignUpStore } from '@/presentation/sign-up/sign-up.store'
import { NotificationService } from '@/application/services/notification.service'
import { AuthNetRepository } from '@/infrastructure/repositories/auth.repository'

import { SYMBOLS } from './symbols'

const container = new Container()

container.bind<MobxQueryClient>(SYMBOLS.QueryClient).toConstantValue(mobxQueryClient)

// Repositories
container.bind<AuthRepository>(SYMBOLS.AuthRepository).to(AuthNetRepository).inSingletonScope()

// Services
container.bind<AuthService>(SYMBOLS.AuthService).to(AuthService).inSingletonScope()
container.bind<NotificationService>(SYMBOLS.NotificationService).to(NotificationService).inSingletonScope()

// Stores
container.bind<SignInStore>(SYMBOLS.SignInStore).to(SignInStore).inSingletonScope()
container.bind<SignUpStore>(SYMBOLS.SignUpStore).to(SignUpStore).inSingletonScope()
container.bind<UserStore>(SYMBOLS.UserStore).to(UserStore).inSingletonScope()

export { container }

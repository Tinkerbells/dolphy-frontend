import { ContainerModule } from 'inversify'

import type { NotificationPort } from '@/domain'

import { NotificationService } from '@/infrastructure'

import { Symbols } from '../symbols'

export const notificationModule = new ContainerModule((options) => {
  options.bind<NotificationPort>(Symbols.NotificationService).to(NotificationService).inSingletonScope()
})

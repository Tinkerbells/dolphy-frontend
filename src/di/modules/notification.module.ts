import { ContainerModule } from 'inversify'

import type { NotificationPort } from '@/domain/notification/notification.port'

import { NotificationService } from '@/infrastructure/services/notification.service'

import { Symbols } from '../symbols'

export const notificationModule = new ContainerModule((options) => {
  options.bind<NotificationPort>(Symbols.NotificationService).to(NotificationService).inSingletonScope()
})

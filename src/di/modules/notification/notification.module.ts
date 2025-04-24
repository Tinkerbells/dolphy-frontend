import { ContainerModule } from 'inversify'

import type { NotificationPort } from '@/domain/notification/notification.port'

import { NotificationService } from '@/infrastructure/services/notification.service'

import { NotificationSymbols } from './notification.symbol'

export const notificationModule = new ContainerModule((options) => {
  options.bind<NotificationPort>(NotificationSymbols.NotificationService).to(NotificationService).inSingletonScope()
})

import { injectable } from 'inversify'
import { notifications } from '@mantine/notifications'

import type { NotificationService as NotificationServiceInterface } from '../application/ports'

@injectable()
export class MantineNotificationService implements NotificationServiceInterface {
  notify(message: string): void {
    notifications.show({
      title: 'FlashCards',
      message,
      autoClose: 3000,
    })
  }
}

export function useNotifier(): NotificationServiceInterface {
  return new MantineNotificationService()
}

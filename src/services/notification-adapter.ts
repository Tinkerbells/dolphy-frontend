import { notifications } from '@mantine/notifications'

import type { NotificationService } from '../application/ports'

export function useNotifier(): NotificationService {
  return {
    notify(message: string): void {
      notifications.show({
        title: 'FlashCards',
        message,
        autoClose: 3000,
      })
    },
  }
}

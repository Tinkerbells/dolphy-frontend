import { injectable } from 'inversify'
import { createContext, useContext } from 'react'
import { notifications } from '@mantine/notifications'

export interface NotificationService {
  notify: (message: string) => void
}

@injectable()
export class MantineNotificationService implements NotificationService {
  notify(message: string): void {
    notifications.show({
      title: 'FlashCards',
      message,
      autoClose: 3000,
    })
  }
}

// Create context for using notification service in components
const NotificationServiceContext = createContext<NotificationService | null>(null)

export const NotificationServiceProvider = NotificationServiceContext.Provider

export function useNotificationService() {
  const context = useContext(NotificationServiceContext)
  if (!context) {
    throw new Error('useNotificationService must be used within NotificationServiceProvider')
  }
  return context
}

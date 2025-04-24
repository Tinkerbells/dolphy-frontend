import { toast } from 'sonner'
import { injectable } from 'inversify'

import type { NotificationPort } from '@/domain/notification/notification.port'

@injectable()
export class NotificationService implements NotificationPort {
  success(message: string, description?: string) {
    toast.success(message, {
      description,
    })
  }

  error(message: string, description?: string) {
    toast.error(message, {
      description,
    })
  }

  info(message: string, description?: string) {
    toast.info(message, {
      description,
    })
  }

  warning(message: string, description?: string) {
    toast.warning(message, {
      description,
    })
  }
}

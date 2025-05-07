import { toast } from 'sonner'
import { injectable } from 'inversiland'

import type { NotifyPort } from '@/core/domain/ports/notify.port'

@injectable()
export class Notify implements NotifyPort {
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

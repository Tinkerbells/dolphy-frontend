import { toast } from 'sonner'

import type { Notify } from '../types'

class NotifyService implements Notify {
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

export const notify = new NotifyService()

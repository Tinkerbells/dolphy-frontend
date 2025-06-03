import { toast } from 'sonner'

export interface Notify {
  success: (message: string, description?: string) => void
  info: (message: string, description?: string) => void
  error: (message: string, description?: string) => void
  warning: (message: string, description?: string) => void
}

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

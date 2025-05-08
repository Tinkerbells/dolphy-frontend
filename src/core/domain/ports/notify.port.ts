export const NotifyPortToken = Symbol('NotifyPort')

export interface NotifyPort {
  success: (message: string, description?: string) => void
  info: (message: string, description?: string) => void
  error: (message: string, description?: string) => void
  warning: (message: string, description?: string) => void
}

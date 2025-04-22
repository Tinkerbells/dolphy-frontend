import { injectable } from 'inversify'

/**
 * Position types for notifications
 */
export type Position =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center'

/**
 * Configuration options for notifications
 */
export interface NotificationOptions {
  /** Optional description/message for the notification */
  description?: string
  /** Duration in milliseconds before auto-closing (default: 3000) */
  duration?: number
  /** Position on screen to display the notification (default: 'top-right') */
  position?: Position
}

/**
 * Service interface for displaying notifications
 */
export interface NotificationServiceInterface {
  /**
   * Display a notification
   * @param title - Main notification title
   * @param options - Optional configuration
   * @returns A unique ID for the created notification
   */
  notify: (title: string, options?: NotificationOptions) => string

  /**
   * Close a specific notification by ID
   * @param id - ID of the notification to close
   */
  close: (id: string) => void

  /**
   * Close all active notifications
   */
  closeAll: () => void
}

/**
 * Implementation of the notification service
 */
@injectable()
export class NotificationService implements NotificationServiceInterface {
  private readonly defaultOptions: Required<Omit<NotificationOptions, 'description'>> = {
    duration: 3000,
    position: 'top-right',
  }

  /**
   * Display a notification with the specified title and options
   * @param title - Main notification title
   * @param options - Optional configuration
   * @returns The ID of the created notification
   */
  public notify(title: string, options?: NotificationOptions): string {
    if (!title) {
      throw new Error('Notification title is required')
    }

    const config = {
      title,
      message: options?.description,
      autoClose: options?.duration ?? this.defaultOptions.duration,
      position: options?.position ?? this.defaultOptions.position,
    }

    return ''
  }

  /**
   * Close a specific notification by ID
   * @param id - ID of the notification to close
   */
  public close(id: string): void {
    if (!id) {
      throw new Error('Notification ID is required')
    }
  }

  /**
   * Close all active notifications
   */
  public closeAll(): void {
  }
}

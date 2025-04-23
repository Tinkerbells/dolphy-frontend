import { toast } from 'sonner'
import { Injectable } from '@wox-team/wox-inject'

/**
 * Сервис для отображения различных типов уведомлений
 */
@Injectable()
export class NotificationService {
  /**
   * Показывает успешное уведомление
   *
   * @param {string} message - Основной текст уведомления
   * @param {string} [description] - Дополнительное описание (опционально)
   */
  success(message: string, description?: string) {
    toast.success(message, {
      description,
    })
  }

  /**
   * Показывает уведомление об ошибке
   *
   * @param {string} message - Основной текст уведомления
   * @param {string} [description] - Дополнительное описание (опционально)
   */
  error(message: string, description?: string) {
    toast.error(message, {
      description,
    })
  }

  /**
   * Показывает информационное уведомление
   *
   * @param {string} message - Основной текст уведомления
   * @param {string} [description] - Дополнительное описание (опционально)
   */
  info(message: string, description?: string) {
    toast.info(message, {
      description,
    })
  }

  /**
   * Показывает предупреждающее уведомление
   *
   * @param {string} message - Основной текст уведомления
   * @param {string} [description] - Дополнительное описание (опционально)
   */
  warning(message: string, description?: string) {
    toast.warning(message, {
      description,
    })
  }
}

export const ModalPortToken = Symbol('ModalDialogPort')

/**
 * Базовый интерфейс для параметров модальных окон
 */
export interface ModalWindowBase {
  onClose?: () => void
}

/**
 * Опции для отображения модального окна
 */
export interface ModalOptions<P extends ModalWindowBase = ModalWindowBase> {
  key: string
  element: React.ComponentType<P>
  props: P
}

/**
 * Интерфейс для работы с модальными окнами
 */
export interface ModalPort {
  /**
   * Показывает модальное окно
   * @param options Параметры модального окна
   */
  show: <T extends ModalWindowBase>(options: ModalOptions<T>) => void

  /**
   * Скрывает модальное окно по ключу
   * @param key Ключ модального окна
   */
  hide: (key: string) => void

  /**
   * Скрывает все модальные окна
   */
  hideAll: () => void
}

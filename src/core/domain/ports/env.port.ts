export const EnvPortToken = Symbol('EnvPort')

/**
 * Интерфейс сервиса окружения, предоставляющего доступ к переменным окружения
 * @template T - Тип структуры переменных окружения
 */
export interface EnvPort<T extends Record<string, any>> {
  /**
   * Получить конкретную переменную окружения по ключу
   *
   * @param key - Имя переменной окружения
   * @returns Значение переменной окружения с правильной типизацией
   */
  get: <K extends keyof T>(key: K) => T[K]

  /**
   * Получить все переменные окружения
   *
   * @returns Объект, содержащий все переменные окружения
   */
  getAll: () => T

  /**
   * Проверить, является ли текущее окружение production
   *
   * @returns true, если окружение — production, иначе false
   */
  isProduction: () => boolean

  /**
   * Проверить, является ли текущее окружение development
   *
   * @returns true, если окружение — development, иначе false
   */
  isDevelopment: () => boolean
}

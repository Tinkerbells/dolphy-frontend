import { injectable } from 'inversiland'

import type { PersistStoragePort } from '@/core/domain/ports/persist-storage.port'

/**
 * Ошибка сервиса локального хранилища
 */
export class LocalStorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LocalStorageError'
  }
}

/**
 * Сервис для работы с localStorage, реализующий PersistPort
 */
@injectable()
export class LocalStorageAdapter implements PersistStoragePort {
  /**
   * Получает данные из localStorage
   *
   * @param {string} key - Ключ для получения данных
   * @returns {string | null} Данные или null если данные не найдены
   */
  get(key: string): string | null {
    try {
      return localStorage.getItem(key)
    }
    catch (error) {
      console.error(`Ошибка при получении данных из localStorage (${key}):`, error)
      return null
    }
  }

  /**
   * Получает данные из localStorage как строку
   *
   * @param {string} key - Ключ для получения данных
   * @returns {string} Данные как строка или пустая строка если данные не найдены
   */
  getAsString(key: string): string {
    return this.get(key) || ''
  }

  /**
   * Получает данные из localStorage как целое число
   *
   * @param {string} key - Ключ для получения данных
   * @returns {number} Данные как целое число или 0 если данные не найдены или не могут быть преобразованы
   */
  getAsInt(key: string): number {
    const value = this.get(key)
    if (!value)
      return 0

    try {
      const num = Number.parseInt(value, 10)
      return Number.isNaN(num) ? 0 : num
    }
    catch {
      return 0
    }
  }

  /**
   * Получает данные из localStorage как число с плавающей точкой
   *
   * @param {string} key - Ключ для получения данных
   * @returns {number} Данные как число с плавающей точкой или 0.0 если данные не найдены или не могут быть преобразованы
   */
  getAsFloat(key: string): number {
    const value = this.get(key)
    if (!value)
      return 0.0

    try {
      const num = Number.parseFloat(value)
      return Number.isNaN(num) ? 0.0 : num
    }
    catch {
      return 0.0
    }
  }

  /**
   * Получает данные из localStorage как булево значение
   *
   * @param {string} key - Ключ для получения данных
   * @returns {boolean} Данные как булево значение (true если значение равно строке "true", иначе false)
   */
  getAsBoolean(key: string): boolean {
    return this.get(key) === 'true'
  }

  /**
   * Получает данные из localStorage как объект
   *
   * @param {string} key - Ключ для получения данных
   * @returns {T} Десериализованный объект или пустой объект если данные не найдены или не могут быть десериализованы
   */
  getAsObject<T extends object = object>(key: string): T {
    const value = this.get(key)
    if (!value)
      return {} as T

    try {
      return JSON.parse(value) as T
    }
    catch {
      console.error(`Ошибка при парсинге JSON из localStorage (${key})`)
      return {} as T
    }
  }

  /**
   * Проверяет наличие данных в localStorage по ключу
   *
   * @param {string} key - Ключ для проверки
   * @returns {boolean} true если данные существуют, иначе false
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Сохраняет примитивное значение в localStorage
   *
   * @param {string} key - Ключ для сохранения данных
   * @param {number | string | boolean | null} value - Значение для сохранения
   * @throws {LocalStorageError} В случае ошибки сохранения
   */
  setPrimitive(key: string, value: number | string | boolean | null): void {
    try {
      if (value === null) {
        localStorage.removeItem(key)
      }
      else {
        localStorage.setItem(key, String(value))
      }
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`Ошибка при сохранении данных в localStorage (${key}):`, error)

      if (errorMessage.includes('QuotaExceededError') || errorMessage.includes('quota_exceeded')) {
        throw new LocalStorageError('Превышен лимит хранилища localStorage. Пожалуйста, освободите место, удалив ненужные данные.')
      }
      else {
        throw new LocalStorageError(`Не удалось сохранить данные в localStorage: ${errorMessage}`)
      }
    }
  }

  /**
   * Сохраняет объект в localStorage
   *
   * @param {string} key - Ключ для сохранения данных
   * @param {object} value - Объект для сохранения
   * @throws {LocalStorageError} В случае ошибки сохранения или сериализации
   */
  setObject(key: string, value: object): void {
    try {
      const serialized = JSON.stringify(value)
      this.setPrimitive(key, serialized)
    }
    catch (error) {
      console.error(`Ошибка при сериализации объекта для localStorage (${key}):`, error)
      throw new LocalStorageError('Не удалось сериализовать объект для сохранения в localStorage')
    }
  }

  /**
   * Удаляет данные из localStorage по ключу
   *
   * @param {string} key - Ключ данных для удаления
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    }
    catch (error) {
      console.error(`Ошибка при удалении данных из localStorage (${key}):`, error)
    }
  }

  /**
   * Очищает всё хранилище localStorage
   */
  clear(): void {
    try {
      localStorage.clear()
    }
    catch (error) {
      console.error('Ошибка при очистке localStorage:', error)
    }
  }
}

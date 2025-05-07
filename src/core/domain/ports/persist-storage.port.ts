export const PersistStoragePortToken = Symbol()
/**
 * Интерфейс для работы с постоянным хранилищем данных
 */
export interface PersistStoragePort {
  /**
   * Получает данные из хранилища
   *
   * @param {string} key - Ключ для получения данных
   * @returns {string | null} Данные из хранилища или null если данные не найдены
   */
  get: (key: string) => string | null

  /**
   * Получает данные из хранилища как строку
   *
   * @param {string} key - Ключ для получения данных
   * @returns {string} Данные из хранилища как строка или пустая строка если данные не найдены
   */
  getAsString: (key: string) => string

  /**
   * Получает данные из хранилища как целое число
   *
   * @param {string} key - Ключ для получения данных
   * @returns {number} Данные из хранилища как целое число или 0 если данные не найдены или не могут быть преобразованы
   */
  getAsInt: (key: string) => number

  /**
   * Получает данные из хранилища как число с плавающей точкой
   *
   * @param {string} key - Ключ для получения данных
   * @returns {number} Данные из хранилища как число с плавающей точкой или 0.0 если данные не найдены или не могут быть преобразованы
   */
  getAsFloat: (key: string) => number

  /**
   * Получает данные из хранилища как булево значение
   *
   * @param {string} key - Ключ для получения данных
   * @returns {boolean} Данные из хранилища как булево значение (true если значение равно строке "true", иначе false)
   */
  getAsBoolean: (key: string) => boolean

  /**
   * Получает данные из хранилища как объект
   *
   * @param {string} key - Ключ для получения данных
   * @returns {T} Десериализованный объект из хранилища или пустой объект если данные не найдены или не могут быть десериализованы
   */
  getAsObject: <T extends object = object>(key: string) => T

  /**
   * Проверяет наличие данных в хранилище по ключу
   *
   * @param {string} key - Ключ для проверки
   * @returns {boolean} true если данные существуют, иначе false
   */
  has: (key: string) => boolean

  /**
   * Сохраняет примитивное значение в хранилище
   *
   * @param {string} key - Ключ для сохранения данных
   * @param {number | string | boolean | null} value - Значение для сохранения
   */
  setPrimitive: (key: string, value: number | string | boolean | null) => void

  /**
   * Сохраняет объект в хранилище
   *
   * @param {string} key - Ключ для сохранения данных
   * @param {object} value - Объект для сохранения
   */
  setObject: (key: string, value: object) => void

  /**
   * Удаляет данные из хранилища по ключу
   *
   * @param {string} key - Ключ данных для удаления
   */
  remove: (key: string) => void

  /**
   * Очищает всё хранилище
   */
  clear: () => void
}

import { validateSync } from 'class-validator'
import { plainToClass } from 'class-transformer'

import { ViteEnvironmentVariables } from './vite-env'

/**
 * Интерфейс сервиса окружения, предоставляющего доступ к переменным окружения
 * @template T - Тип структуры переменных окружения
 */
export interface Env<T extends Record<string, any>> {
  get: <K extends keyof T>(key: K) => T[K]
  getAll: () => T
  isProduction: () => boolean
  isDevelopment: () => boolean
}

/**
 * Сервис для загрузки и валидации переменных окружения Vite
 */
class EnvService implements Env<ViteEnvironmentVariables> {
  private readonly envConfig: ViteEnvironmentVariables

  constructor() {
    // В Vite import.meta.env содержит переменные окружения
    const env = import.meta.env

    // Преобразование обычного объекта env в экземпляр класса
    this.envConfig = this.validateConfig({
      MODE: env.MODE,
      PROD: env.PROD,
      DEV: env.DEV,
      VITE_API_URL: env.VITE_API_URL,
      VITE_APP_TITLE: env.VITE_APP_TITLE,
      VITE_ENABLE_ANALYTICS: env.VITE_ENABLE_ANALYTICS === 'true',
      VITE_OPTIONAL_FEATURE: env.VITE_OPTIONAL_FEATURE,
    })
  }

  /**
   * Валидация конфигурации с помощью валидаторов класса
   */
  private validateConfig(config: Record<string, any>): ViteEnvironmentVariables {
    const validatedConfig = plainToClass(
      ViteEnvironmentVariables,
      config,
      { enableImplicitConversion: true },
    )

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    })

    if (errors.length > 0) {
      const errorMessages = errors.map((error) => {
        const constraints = error.constraints ? Object.values(error.constraints) : []
        return `${error.property}: ${constraints.join(', ')}`
      })

      console.error(`Валидация окружения не удалась: ${errorMessages.join(', ')}`)

      // В режиме разработки выбрасываем ошибку, чтобы сделать проблемы очевидными
      if (config.DEV) {
        throw new Error(`Валидация окружения не удалась: ${errorMessages.join(', ')}`)
      }
    }

    return validatedConfig
  }

  /**
   * Получить значение определенной переменной окружения
   */
  get<K extends keyof ViteEnvironmentVariables>(key: K): ViteEnvironmentVariables[K] {
    return this.envConfig[key]
  }

  /**
   * Получить все валидированные переменные окружения
   */
  getAll(): ViteEnvironmentVariables {
    return this.envConfig
  }

  /**
   * Проверить, является ли окружение продакшн
   */
  isProduction(): boolean {
    return this.envConfig.PROD === true
  }

  /**
   * Проверить, является ли окружение средой разработки
   */
  isDevelopment(): boolean {
    return this.envConfig.DEV === true
  }
}

export const env = new EnvService()

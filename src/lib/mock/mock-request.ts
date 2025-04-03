// src/lib/mock/mock-request.ts

/**
 * Конфигурация для мок-запросов
 */
export interface MockRequestOptions<T> {
  /**
   * Данные, возвращаемые при успешном запросе
   */
  data: T

  /**
   * Задержка в миллисекундах для имитации сетевой задержки
   */
  delay?: number

  /**
   * Вероятность сбоя запроса (0-1)
   * 0 = всегда успешно, 1 = всегда неудача
   */
  failureProbability?: number

  /**
   * Сообщение об ошибке в случае сбоя
   */
  errorMessage?: string
}

/**
 * Имитирует сетевой запрос с настраиваемой задержкой и вероятностью сбоя
 */
export async function mockRequest<T>(options: MockRequestOptions<T>): Promise<T> {
  const {
    data,
    delay = 300,
    failureProbability = 0,
    errorMessage = 'Mock request failed',
  } = options

  // Имитация сетевой задержки
  await new Promise(resolve => setTimeout(resolve, delay))

  // Имитация случайных сбоев, если failureProbability > 0
  if (failureProbability > 0 && Math.random() < failureProbability) {
    throw new Error(errorMessage)
  }

  // Возвращаем мок-данные
  return data
}

/**
 * Создает типизированный мок-репозиторий для коллекции данных
 */
export function createMockCollection<T extends { id: string }>(initialData: T[] = []) {
  let collection = [...initialData]

  return {
    getAll: async (options?: Partial<MockRequestOptions<T[]>>) => {
      return mockRequest<T[]>({
        data: [...collection],
        ...(options || {}),
      })
    },

    getById: async (id: string, options?: Partial<MockRequestOptions<T | null>>) => {
      const item = collection.find(item => item.id === id) || null
      return mockRequest<T | null>({
        data: item ? { ...item } : null,
        ...(options || {}),
      })
    },

    create: async (item: Omit<T, 'id'> & { id?: string }, options?: Partial<MockRequestOptions<T>>) => {
      const id = item.id || Math.random().toString(36).substring(2, 15)
      const newItem = { ...item, id } as T
      collection.push(newItem)

      return mockRequest<T>({
        data: { ...newItem },
        ...(options || {}),
      })
    },

    update: async (id: string, updates: Partial<T>, options?: Partial<MockRequestOptions<T | null>>) => {
      const index = collection.findIndex(item => item.id === id)
      if (index === -1) {
        return mockRequest<null>({
          data: null,
          ...(options || {}),
        })
      }

      collection[index] = { ...collection[index], ...updates }

      return mockRequest<T>({
        data: { ...collection[index] },
        ...(options || {}),
      })
    },

    delete: async (id: string, options?: Partial<MockRequestOptions<boolean>>) => {
      const initialLength = collection.length
      collection = collection.filter(item => item.id !== id)

      return mockRequest<boolean>({
        data: collection.length < initialLength,
        ...(options || {}),
      })
    },

    // Функция для ручного изменения коллекции (для тестирования)
    _setCollection: (newCollection: T[]) => {
      collection = [...newCollection]
    },
  }
}

import type { Milliseconds } from '@/types/primitive.types'

/**
 * Создает задержку указанной длительности
 */
export function pause(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

/**
 * Возвращает мок-ответ после указанной задержки
 */
export async function mockRequest<T>(delay: Milliseconds, response?: T): Promise<T> {
  await pause(delay)
  return response as T
}

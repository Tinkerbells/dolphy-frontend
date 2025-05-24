import type {
  DefaultError,
  QueryKey,
} from '@tanstack/query-core'

// Абстрактные интерфейсы для результатов
export interface CacheQueryResult<TData, TError = DefaultError> {
  data: TData | undefined
  error: TError | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  isFetching: boolean
  isFetched: boolean
  refetch: () => Promise<any>
}

export interface CacheMutationResult<TData, TVariables = void, TError = DefaultError> {
  data: TData | undefined
  error: TError | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  isIdle: boolean
  variables: TVariables | undefined
  mutate: (variables: TVariables) => Promise<any>
  reset: () => void
}

// Абстрактные интерфейсы для запросов и мутаций
export interface CacheQuery<TData, TError = DefaultError> {
  /**
   * Реактивный результат запроса
   */
  readonly result: CacheQueryResult<TData, TError>

  /**
   * Асинхронно получить данные запроса.
   * Ожидает завершения загрузки и возвращает данные или выбрасывает ошибку.
   */
  async: () => Promise<TData>

  /**
   * Повторно выполнить запрос
   */
  refetch: () => Promise<CacheQueryResult<TData, TError>>

  /**
   * Инвалидировать запрос
   */
  invalidate: () => Promise<void>

  /**
   * Уничтожить запрос
   */
  destroy: () => void
}

export interface CacheMutation<TData, TVariables = void, TError = DefaultError> {
  /**
   * Реактивный результат мутации
   */
  readonly result: CacheMutationResult<TData, TVariables, TError>

  /**
   * Асинхронно выполнить мутацию.
   * Выполняет мутацию и возвращает результат или выбрасывает ошибку.
   */
  async: (variables: TVariables) => Promise<TData>

  /**
   * Выполнить мутацию
   */
  mutate: (variables: TVariables) => Promise<CacheMutationResult<TData, TVariables, TError>>

  /**
   * Сбросить состояние мутации
   */
  reset: () => void

  /**
   * Уничтожить мутацию
   */
  destroy: () => void
}

// Опции для создания запросов и мутаций
export interface CreateQueryOptions<TError = DefaultError> {
  enabled?: boolean
  staleTime?: number
  refetchOnWindowFocus?: boolean
  retry?: number | boolean
  onSuccess?: (data: any) => void
  onError?: (error: TError) => void
}

export interface CreateMutationOptions<TData, TVariables = void, TError = DefaultError> {
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: TError, variables: TVariables) => void
  onSettled?: (data: TData | undefined, error: TError | null) => void
  invalidateQueries?: {
    queryKeys?: QueryKey[]
  } | ((data: TData, variables: TVariables) => {
    queryKeys?: QueryKey[]
  })
}

// Основной интерфейс кэш-сервиса (порт)
export interface CacheService {
  /**
   * Создает кэшированный запрос
   */
  createQuery: <TData, TError = DefaultError>(
    queryKey: QueryKey,
    queryFn: () => Promise<TData>,
    options?: CreateQueryOptions<TError>
  ) => CacheQuery<TData, TError>

  /**
   * Создает мутацию
   */
  createMutation: <TData, TVariables = void, TError = DefaultError>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: CreateMutationOptions<TData, TVariables, TError>
  ) => CacheMutation<TData, TVariables, TError>

  /**
   * Инвалидирует запросы по ключу
   */
  invalidateQueries: (queryKey: QueryKey) => Promise<void>

  /**
   * Очищает кэш всех запросов
   */
  clear: () => void

  /**
   * Устанавливает данные для конкретного запроса
   */
  setQueryData: <TData>(queryKey: QueryKey, data: TData) => void

  /**
   * Получает данные для конкретного запроса из кэша
   */
  getQueryData: <TData>(queryKey: QueryKey) => TData | undefined
}

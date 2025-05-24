import type { DefaultError, QueryKey } from '@tanstack/query-core'

import { when } from 'mobx'
import { MobxMutation, MobxQuery, MobxQueryClient } from 'mobx-tanstack-query'

import type {
  CacheMutation,
  CacheMutationResult,
  CacheQuery,
  CacheQueryResult,
  CacheService,
  CreateMutationOptions,
  CreateQueryOptions,
} from '../types'

class MobxCacheQuery<TData, TError = DefaultError> implements CacheQuery<TData, TError> {
  private mobxQuery: MobxQuery<TData, TError>

  constructor(mobxQuery: MobxQuery<TData, TError>) {
    this.mobxQuery = mobxQuery
  }

  get result(): CacheQueryResult<TData, TError> {
    const result = this.mobxQuery.result
    return {
      data: result.data,
      error: result.error,
      isLoading: result.isLoading,
      isError: result.isError,
      isSuccess: result.isSuccess,
      isFetching: result.isFetching,
      isFetched: result.isFetched,
      refetch: () => this.refetch(),
    }
  }

  async async(): Promise<TData> {
    if (this.mobxQuery.result.isSuccess && this.mobxQuery.result.data !== undefined) {
      return this.mobxQuery.result.data
    }

    if (!this.mobxQuery.result.isFetching && !this.mobxQuery.result.isFetched) {
      this.mobxQuery.refetch()
    }

    await when(() => !this.mobxQuery.result.isLoading)

    if (this.mobxQuery.result.isError) {
      throw this.mobxQuery.result.error
    }

    if (this.mobxQuery.result.data === undefined) {
      throw new Error('Query returned undefined data')
    }

    return this.mobxQuery.result.data
  }

  async refetch(): Promise<CacheQueryResult<TData, TError>> {
    await this.mobxQuery.refetch()
    return this.result
  }

  async invalidate(): Promise<void> {
    await this.mobxQuery.invalidate()
  }

  destroy(): void {
    this.mobxQuery.destroy()
  }

  // Для доступа к оригинальному MobxQuery при необходимости
  get original(): MobxQuery<TData, TError> {
    return this.mobxQuery
  }
}

// Класс-обертка для MobxMutation
class MobxCacheMutation<TData, TVariables = void, TError = DefaultError> implements CacheMutation<TData, TVariables, TError> {
  private mobxMutation: MobxMutation<TData, TVariables, TError>

  constructor(mobxMutation: MobxMutation<TData, TVariables, TError>) {
    this.mobxMutation = mobxMutation
  }

  get result(): CacheMutationResult<TData, TVariables, TError> {
    const result = this.mobxMutation.result
    return {
      data: result.data,
      error: result.error,
      isLoading: result.isPending, // MobX использует isPending вместо isLoading
      isError: result.isError,
      isSuccess: result.isSuccess,
      isIdle: result.isIdle,
      variables: result.variables,
      mutate: (variables: TVariables) => this.mutate(variables),
      reset: () => this.mobxMutation.reset(),
    }
  }

  async async(variables: TVariables): Promise<TData> {
    const result = await this.mobxMutation.mutate(variables)

    if (result.isError) {
      throw result.error
    }

    if (result.data === undefined) {
      throw new Error('Mutation returned undefined data')
    }

    return result.data
  }

  async mutate(variables: TVariables): Promise<CacheMutationResult<TData, TVariables, TError>> {
    await this.mobxMutation.mutate(variables)
    return this.result
  }

  reset(): void {
    this.mobxMutation.reset()
  }

  destroy(): void {
    this.mobxMutation.destroy()
  }

  // Для доступа к оригинальному MobxMutation при необходимости
  get original(): MobxMutation<TData, TVariables, TError> {
    return this.mobxMutation
  }
}

// ОСНОВНОЙ СЕРВИС КЭША - используйте этот класс!
class MobxCacheService implements CacheService {
  private readonly queryClient: MobxQueryClient

  constructor(queryClient?: MobxQueryClient) {
    this.queryClient = queryClient || new MobxQueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 минут
          refetchOnWindowFocus: false,
          retry: 3,
        },
        mutations: {
          retry: 1,
        },
      },
    })
  }

  public createQuery<TData, TError = DefaultError, TQueryKey extends QueryKey = QueryKey>(
    queryKey: TQueryKey,
    queryFn: () => Promise<TData>,
    options?: CreateQueryOptions<TError>,
  ): CacheQuery<TData, TError> {
    const mobxQuery = new MobxQuery<TData, TError, TQueryKey>({
      queryClient: this.queryClient,
      queryKey,
      queryFn: async ({ signal }) => {
        if (signal?.aborted) {
          throw new Error('Query was aborted')
        }
        return await queryFn()
      },
      enabled: options?.enabled,
      staleTime: options?.staleTime,
      refetchOnWindowFocus: options?.refetchOnWindowFocus,
      retry: options?.retry,
      onDone: options?.onSuccess,
      onError: options?.onError,
    })

    return new MobxCacheQuery(mobxQuery)
  }

  public createMutation<TData, TVariables = void, TError = DefaultError>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: CreateMutationOptions<TData, TVariables, TError>,
  ): CacheMutation<TData, TVariables, TError> {
    const mobxMutation = new MobxMutation<TData, TVariables, TError>({
      queryClient: this.queryClient,
      mutationFn: async (variables) => {
        return await mutationFn(variables)
      },
      onSuccess: options?.onSuccess,
      onError: options?.onError,
      invalidateQueries: typeof options?.invalidateQueries === 'function'
        ? options.invalidateQueries
        : options?.invalidateQueries,
    })

    return new MobxCacheMutation(mobxMutation)
  }

  public async invalidateQueries(queryKey: QueryKey): Promise<void> {
    await this.queryClient.invalidateQueries({ queryKey })
  }

  public clear(): void {
    this.queryClient.clear()
  }

  public setQueryData<TData>(queryKey: QueryKey, data: TData): void {
    this.queryClient.setQueryData(queryKey, data)
  }

  public getQueryData<TData>(queryKey: QueryKey): TData | undefined {
    return this.queryClient.getQueryData<TData>(queryKey)
  }

  /**
   * Получает клиент для прямого доступа к методам TanStack Query
   */
  public getClient(): MobxQueryClient {
    return this.queryClient
  }
}

export const cacheInstance = new MobxCacheService()

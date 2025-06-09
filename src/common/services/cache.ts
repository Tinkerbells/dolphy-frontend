import type { DefaultError, QueryKey } from '@tanstack/query-core'
import type {
  MutationConfig,
  QueryFn,
} from 'mobx-tanstack-query'
import type {
  CreateMutationParams,
  CreateQueryParams,
} from 'mobx-tanstack-query/preset'

import { hashKey } from '@tanstack/query-core'
import {
  Query,
  QueryClient,
} from 'mobx-tanstack-query'
import {
  createMutation as baseCreateMutation,
} from 'mobx-tanstack-query/preset'

export class CacheService {
  private readonly abortController: AbortController
  private readonly queryClient: QueryClient

  constructor(queryClient?: QueryClient) {
    this.abortController = new AbortController()
    this.queryClient = queryClient || new QueryClient({
      defaultOptions: {
        queries: {
          throwOnError: true,
          queryKeyHashFn: hashKey,
          staleTime: 5 * 60 * 1000,
          refetchOnWindowFocus: 'always',
          refetchOnReconnect: 'always',
          retry: 3,
        },
        mutations: {
          throwOnError: true,
        },
      },
    })
  }

  public createQuery<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    queryFn: QueryFn<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
    params?: CreateQueryParams<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  ) {
    return new Query<TQueryFnData, TError, TData, TQueryData, TQueryKey>({
      queryFn,
      queryClient: this.queryClient,
      ...params,
    })
  }

  public createMutation<
    TData = unknown,
    TVariables = void,
    TError = Error,
    TContext = unknown,
  >(
    mutationFn: MutationConfig<TData, TVariables, TError, TContext>['mutationFn'],
    params?: Omit<CreateMutationParams<TData, TVariables, TError, TContext>, 'queryClient'>,
  ) {
    return baseCreateMutation(mutationFn, {
      ...params,
      queryClient: this.queryClient,
      abortSignal: this.abortController.signal,
    })
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

  public getClient(): QueryClient {
    return this.queryClient
  }
}

export const cacheInstance = new CacheService()

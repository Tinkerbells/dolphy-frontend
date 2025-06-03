import type { QueryKey } from '@tanstack/query-core'
import type { CreateMutationParams } from 'mobx-tanstack-query/preset'
import type { MobxMutationConfig, MobxQueryConfig, MobxQueryFn } from 'mobx-tanstack-query'

import {
  MobxQuery,
  MobxQueryClient,
} from 'mobx-tanstack-query'
import {
  createMutation as baseCreateMutation,
  // createQuery as baseCreateQuery,
} from 'mobx-tanstack-query/preset'

import { queryClient } from '@/app/react'

export class CacheService {
  private readonly abortController: AbortController
  private readonly queryClient: MobxQueryClient

  constructor(queryClient?: MobxQueryClient) {
    this.abortController = new AbortController()
    this.queryClient = queryClient || new MobxQueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          refetchOnWindowFocus: false,
          retry: 3,
        },
        mutations: {
          retry: 0,
        },
      },
    })
  }

  // TODO: watch if fixed in next versions of `mobx-tanstack-query`
  public createQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    queryFn: MobxQueryFn<TQueryFnData, TError, TData>,
    params?: Omit<MobxQueryConfig<TQueryFnData, TError, TData, TQueryKey>, 'queryFn' | 'queryClient'>,
  ) {
    return new MobxQuery<TQueryFnData, TError, TData, TQueryKey>({
      queryClient: this.queryClient,
      queryFn,
      ...params,
    })
  }

  public createMutation<
    TData = unknown,
    TVariables = void,
    TError = Error,
    TContext = unknown,
  >(
    mutationFn: MobxMutationConfig<TData, TVariables, TError, TContext>['mutationFn'],
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

  public getClient(): MobxQueryClient {
    return this.queryClient
  }
}

export const cacheInstance = new CacheService(queryClient)

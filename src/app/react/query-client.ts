import { MobxQueryClient } from 'mobx-tanstack-query'

export const queryClient = new MobxQueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 3,
    },
    mutations: {
      retry: 0,
    },
  },
})

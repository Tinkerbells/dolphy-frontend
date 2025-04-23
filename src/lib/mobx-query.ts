import { MobxQueryClient } from 'mobx-tanstack-query'

export const mobxQueryClient = new MobxQueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
})

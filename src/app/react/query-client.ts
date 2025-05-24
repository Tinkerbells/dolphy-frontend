import { MobxQueryClient } from 'mobx-tanstack-query'

export const queryClient = new MobxQueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
})

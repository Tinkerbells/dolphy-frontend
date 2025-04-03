// src/di/container.ts
import { MobxQueryClient } from 'mobx-tanstack-query'

// Create query client with appropriate configuration
export const mobxQueryClient = new MobxQueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
})

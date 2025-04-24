import { ContainerModule } from 'inversify'
import { MobxQueryClient } from 'mobx-tanstack-query'

import { QueryClientSymbols } from './query-client.symbols'

export const queryClientModule = new ContainerModule((options) => {
  options.bind(QueryClientSymbols.QueryClient).toConstantValue(
    new MobxQueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 минут
          refetchOnWindowFocus: true,
          retry: 1,
        },
      },
    }),
  )
})

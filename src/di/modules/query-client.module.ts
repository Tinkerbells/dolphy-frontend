import { ContainerModule } from 'inversify'

import { queryClient } from '@/utils/query-client'

import { Symbols } from '../symbols'

export const queryClientModule = new ContainerModule((options) => {
  options.bind(Symbols.QueryClient).toConstantValue(queryClient)
})

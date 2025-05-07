import type { PropsWithChildren } from 'react'

import { getModuleContainer } from 'inversiland'
import { createContext, useContext } from 'react'

import AppModule from '@/app-module'

type ModuleContainer = ReturnType<typeof getModuleContainer>

export const DIContext = createContext<ModuleContainer | null>(null)

DIContext.displayName = 'DIContext'

export function Provider({ children }: PropsWithChildren) {
  const container = getModuleContainer(AppModule)

  return (
    <DIContext.Provider value={container}>
      {children}
    </DIContext.Provider>
  )
}

export function useInjected<T>(injected: any): T {
  const container = useContext(DIContext)

  if (!container) {
    throw new Error('Component должен быть завернут в Provider')
  }

  return container.get(injected)
}

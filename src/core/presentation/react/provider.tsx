import type { PropsWithChildren } from 'react'

import { getModuleContainer } from 'inversiland'
import { createContext, memo, useContext, useMemo } from 'react'

import AppModule from '@/app-module'

type ModuleContainer = ReturnType<typeof getModuleContainer>

export const DIContext = createContext<ModuleContainer | null>(null)
DIContext.displayName = 'DIContext'

export const Provider = memo(({ children }: PropsWithChildren) => {
  const container = useMemo(() => getModuleContainer(AppModule), [])
  const contextValue = useMemo(() => container, [container])

  return (
    <DIContext.Provider value={contextValue}>
      {children}
    </DIContext.Provider>
  )
})

const injectCache = new Map<any, any>()

export function useInjected<T>(injected: any): T {
  const container = useContext(DIContext)

  if (!container) {
    throw new Error('Component должен быть завернут в Provider')
  }

  return useMemo(() => {
    if (!injectCache.has(injected)) {
      injectCache.set(injected, container.get(injected))
    }
    return injectCache.get(injected)
  }, [container, injected])
}

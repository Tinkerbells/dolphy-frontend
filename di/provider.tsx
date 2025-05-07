import type { Container } from 'inversify'

import React, { createContext, useContext } from 'react'

import { container } from './container'

const InversifyContext = createContext<Container | null>(null)

export const DIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <InversifyContext.Provider value={container}>
      {children}
    </InversifyContext.Provider>
  )
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DIProvider>
      {children}
    </DIProvider>
  )
}

/**
 * Хук для доступа к контейнеру DI
 * @returns Инстанс контейнера
 */
export function useContainer() {
  const context = useContext(InversifyContext)
  if (!context) {
    throw new Error('useContainer должен использоваться внутри DIProvider')
  }
  return context
}

/**
 * Хук для получения сервиса по его идентификатору
 * @param serviceIdentifier Символ идентификатора сервиса
 * @returns Инстанс запрошенного сервиса
 */
export function useService<T>(serviceIdentifier: symbol): T {
  const container = useContainer()
  return container.get<T>(serviceIdentifier)
}

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

// Combined provider that includes all contexts
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get instances from the container
  // const telegramService = container.get<TelegramService>(SYMBOLS.TelegramService)

  return (
    <DIProvider>
      {children}
    </DIProvider>
  )
}
// Hook to access the container
export function useContainer() {
  const context = useContext(InversifyContext)
  if (!context) {
    throw new Error('useContainer must be used within DIProvider')
  }
  return context
}

export function useService<T>(serviceIdentifier: symbol): T {
  const container = useContainer()
  return container.get<T>(serviceIdentifier)
}

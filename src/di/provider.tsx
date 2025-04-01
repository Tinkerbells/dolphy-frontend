import type { Container } from 'inversify'

// src/di/provider.tsx
import React, { createContext, useContext } from 'react'

import { container } from './container'

// Create a React Context for the Inversify Container
const InversifyContext = createContext<{ container: Container | null }>({ container: null })

// Provider component to make the container available in the React tree
export const InversifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <InversifyContext.Provider value={{ container }}>
      {children}
    </InversifyContext.Provider>
  )
}

// Custom hook to use the container in components
export function useContainer() {
  const { container } = useContext(InversifyContext)

  if (!container) {
    throw new Error('useContainer must be used within an InversifyProvider')
  }

  return container
}

// Helper hook to resolve a dependency from the container
export function useService<T>(serviceIdentifier: symbol): T {
  const container = useContainer()
  return container.get<T>(serviceIdentifier)
}

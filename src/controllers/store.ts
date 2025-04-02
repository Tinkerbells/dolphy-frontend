import { createContext, useContext } from 'react'

import type { RootStore } from './root-store'

// Create context for stores
const StoreContext = createContext<RootStore | null>(null)

// Provider component
export const StoreProvider = StoreContext.Provider

// Hook to use stores
export function useStores() {
  const context = useContext(StoreContext)
  if (context === null) {
    throw new Error('useStores must be used within StoreProvider')
  }
  return context
}

// Hooks for individual stores
export function useDeckStore() {
  const { deckStore } = useStores()
  return deckStore
}

export function useCardStore() {
  const { cardStore } = useStores()
  return cardStore
}

export function useStudyStore() {
  const { studyStore } = useStores()
  return studyStore
}

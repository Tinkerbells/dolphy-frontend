import type { Container } from 'inversify'

import React, { createContext, useContext } from 'react'

import type { RootStore } from '../controllers/root-store'
import type { TelegramService } from '../services/telegram-service'
import type { NotificationService } from '../services/notification-service'

import { SYMBOLS } from './symbols'
import { container } from './container'
import { StoreProvider } from '../controllers/store'
import { TelegramServiceProvider } from '../services/telegram-service'
import { NotificationServiceProvider } from '../services/notification-service'

// Context for the container
const InversifyContext = createContext<Container | null>(null)

// DI Provider component
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
  const rootStore = container.get<RootStore>(SYMBOLS.RootStore)
  const notificationService = container.get<NotificationService>(SYMBOLS.NotificationService)
  const telegramService = container.get<TelegramService>(SYMBOLS.TelegramService)

  return (
    <DIProvider>
      <StoreProvider value={rootStore}>
        <NotificationServiceProvider value={notificationService}>
          <TelegramServiceProvider value={telegramService}>
            {children}
          </TelegramServiceProvider>
        </NotificationServiceProvider>
      </StoreProvider>
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

// Hook to resolve a service from the container
export function useService<T>(serviceIdentifier: symbol): T {
  const container = useContainer()
  return container.get<T>(serviceIdentifier)
}

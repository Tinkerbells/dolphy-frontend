import { observer } from 'mobx-react-lite'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { Suspense, useEffect, useMemo } from 'react'
import { Notifications } from '@mantine/notifications'
import { withErrorBoundary } from 'react-error-boundary'
import { AppShell, createTheme, LoadingOverlay, MantineProvider } from '@mantine/core'
import { Navigate, Outlet, Route, HashRouter as Router, Routes } from 'react-router-dom'
import { isMiniAppDark, retrieveLaunchParams, useSignal } from '@telegram-apps/sdk-react'

import { createUser } from './domain/user'
import { BottomNavigation } from './ui/navigation'
import { useTelegram } from './services/telegram-adapter'
import { StoreProvider, useStore } from './services/store'
import { compose, ErrorHandler, logError } from './lib/react'
import { CardEditPage, DeckDetailPage, DecksPage, SettingsPage, StudyPage } from './ui'

// Create theme
const theme = createTheme({
  // Customize theme if needed
})
const MainLayout = observer(() => {
  return (
    <div className="root-wrapper">
      <Outlet />
      <BottomNavigation />
    </div>
  )
})

// Enhance components with error boundary
const enhance = compose(component =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
    onError: logError,
  }),
)

// Global loading component
function GlobalLoading() {
  return (
    <LoadingOverlay
      visible
      zIndex={1000}
      overlayProps={{ radius: 'sm', blur: 1 }}
    />
  )
}

// Router component
const AppRouter = enhance(() => {
  return (
    <Router>
      <Suspense fallback={<GlobalLoading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DecksPage />} />
            <Route path="/deck/:deckId" element={<DeckDetailPage />} />
            <Route path="/study/:deckId" element={<StudyPage />} />
            <Route path="/card/new/:deckId" element={<CardEditPage mode="create" />} />
            <Route path="/card/edit/:cardId" element={<CardEditPage mode="edit" />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
})

// Main app content component with store and theme setup
const AppContent = observer(() => {
  const store = useStore()
  const telegram = useTelegram()
  const isDark = useSignal(isMiniAppDark)
  const lp = useMemo(() => retrieveLaunchParams(), [])

  useEffect(() => {
    // Initialize user if not exists
    if (!store.user) {
      const userId = telegram.getUserId()
      const userName = telegram.getUserName()
      store.setUser(createUser(userId, userName))
    }

    // Load cards from fake data if none exist
    if (store.cards.length === 0 && store.decks.length > 0) {
      import('./services/fake-data').then(({ LOCAL_CARDS }) => {
        store.setCards(LOCAL_CARDS)
      })
    }
  }, [store, telegram])

  return (
    <MantineProvider theme={theme} defaultColorScheme={isDark ? 'dark' : 'light'}>
      <Notifications />
      <AppRoot
        appearance={isDark ? 'dark' : 'light'}
        platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
      >
        <AppRouter />
      </AppRoot>
    </MantineProvider>
  )
})

// Root provider component
const Provider = enhance(() => (
  <StoreProvider>
    <AppContent />
  </StoreProvider>
))

export default Provider

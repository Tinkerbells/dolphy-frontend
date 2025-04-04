import './app.css'
import React, { Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { withErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { isMiniAppDark, useSignal } from '@telegram-apps/sdk-react'
import { AppShell, createTheme, LoadingOverlay, MantineProvider } from '@mantine/core'
import { Navigate, Outlet, Route, HashRouter as Router, Routes } from 'react-router-dom'

import { AppProvider } from './di/provider'
import { mobxQueryClient } from './lib/mobx-query'
import { compose, ErrorHandler, logError } from './lib/react'

// Lazy load page components
const DecksPage = React.lazy(() => import('./pages/decks/decks-page').then(module => ({ default: module.DecksPage })))
const DeckDetailPage = React.lazy(() => import('./pages/decks/deck-detail-page').then(module => ({ default: module.DeckDetailPage })))
const CardsPage = React.lazy(() => import('./pages/cards/cards-page').then(module => ({ default: module.CardsPage })))
const StudyPage = React.lazy(() => import('./pages/study/study-page').then(module => ({ default: module.StudyPage })))
const StatsPage = React.lazy(() => import('./pages/stats/stats-page').then(module => ({ default: module.StatsPage })))

// Create theme
const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
})

const MainLayout = observer(() => {
  return (
    <AppShell className="root-wrapper">
      <Outlet />
      <Notifications position="top-center" />
    </AppShell>
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
// Router component
const AppRouter = enhance(() => {
  return (
    <Router>
      <Suspense fallback={<GlobalLoading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/decks" />} />
            <Route path="/decks" element={<DecksPage />} />
            <Route path="/deck/:deckId" element={<DeckDetailPage />} />
            <Route path="/deck/:deckId/cards" element={<CardsPage />} />
            <Route path="/study/:deckId" element={<StudyPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<Navigate to="/decks" />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
})

function AppContent() {
  const isDark = useSignal(isMiniAppDark)

  return (
    <QueryClientProvider client={mobxQueryClient}>
      <MantineProvider theme={theme} defaultColorScheme={isDark ? 'dark' : 'light'}>
        <ModalsProvider>
          <AppRouter />
          <ReactQueryDevtools position="left" initialIsOpen={false} />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}

// Root provider component
const App = enhance(() => (
  <AppProvider>
    <AppContent />
  </AppProvider>
))

export default App

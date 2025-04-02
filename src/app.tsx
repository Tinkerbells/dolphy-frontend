import React, { Suspense } from 'react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { Notifications } from '@mantine/notifications'
import { withErrorBoundary } from 'react-error-boundary'
import { isMiniAppDark, useSignal } from '@telegram-apps/sdk-react'
import { createTheme, LoadingOverlay, MantineProvider } from '@mantine/core'
import { Navigate, Outlet, Route, HashRouter as Router, Routes } from 'react-router-dom'

import { AppProvider } from './di/provider'
import { compose, ErrorHandler, logError } from './lib/react'

// Lazy load page components
const DecksPage = React.lazy(() => import('./pages/decks/decks-page').then(module => ({ default: module.DecksPage })))
const DeckDetailsPage = React.lazy(() => import('./pages/decks/deck-detail-page').then(module => ({ default: module.DeckDetailsPage })))
const StudyPage = React.lazy(() => import('./pages/decks/study-page').then(module => ({ default: module.StudyPage })))

// Create theme
const theme = createTheme({
  // Customize theme if needed
})

function MainLayout() {
  return (
    <div className="root-wrapper">
      <Outlet />
    </div>
  )
}

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
            <Route path="/deck/:deckId" element={<DeckDetailsPage />} />
            <Route path="/study/:deckId" element={<StudyPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
})

function AppContent() {
  const isDark = useSignal(isMiniAppDark)

  return (
    <MantineProvider theme={theme} defaultColorScheme={isDark ? 'dark' : 'light'}>
      <Notifications />
      <AppRoot
        appearance={isDark ? 'dark' : 'light'}
      >
        <AppRouter />
      </AppRoot>
    </MantineProvider>
  )
}

// Root provider component
const App = enhance(() => (
  <AppProvider>
    <AppContent />
  </AppProvider>
))

export default App

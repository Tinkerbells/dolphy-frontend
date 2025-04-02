import { observer } from 'mobx-react-lite'
import React, { Suspense, useMemo } from 'react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { Notifications } from '@mantine/notifications'
import { withErrorBoundary } from 'react-error-boundary'
import { createTheme, LoadingOverlay, MantineProvider } from '@mantine/core'
import { Navigate, Outlet, Route, HashRouter as Router, Routes } from 'react-router-dom'
import { isMiniAppDark, retrieveLaunchParams, useSignal } from '@telegram-apps/sdk-react'

import { DecksPage } from './ui'
import { InversifyProvider } from './di/provider'
import { BottomNavigation } from './ui/navigation'
import { compose, ErrorHandler, logError } from './lib/react'

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
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
})

const AppContent = observer(() => {
  const isDark = useSignal(isMiniAppDark)
  const lp = useMemo(() => retrieveLaunchParams(), [])

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
  <InversifyProvider>
    <AppContent />
  </InversifyProvider>
))

export default Provider

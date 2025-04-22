import './app.css'

import { RouterProvider } from 'react-router'
import { ModalsProvider } from '@mantine/modals'
import { withErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTheme, MantineProvider } from '@mantine/core'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { isMiniAppDark, useSignal } from '@telegram-apps/sdk-react'

import { AppProvider } from './di/provider'
import { BrowserRouter } from './views/core'
import { mobxQueryClient } from './lib/mobx-query'
import { compose, ErrorHandler, logError } from './lib/react'

// Create theme
const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
})

// Enhance components with error boundary
const enhance = compose(component =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
    onError: logError,
  }),
)

function AppContent() {
  const isDark = useSignal(isMiniAppDark)
  return (
    <QueryClientProvider client={mobxQueryClient}>
      <MantineProvider theme={theme} defaultColorScheme={isDark ? 'dark' : 'light'}>
        <ModalsProvider>
          <BrowserRouter />
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

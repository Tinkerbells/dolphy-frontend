import './app.css'

import { withErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { queryClient } from '@/utils/query-client'

import { BrowserRouter } from '.'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { AppProvider } from '../../di/provider'
import { compose, ErrorHandler, logError } from './react'

const enhance = compose(component =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
    onError: logError,
  }),
)

function AppContent() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter />
      <ReactQueryDevtools position="left" initialIsOpen={false} />
    </QueryClientProvider>
  )
}

const App = enhance(() => (
  <AppProvider>
    <AppContent />
  </AppProvider>
))

export default App

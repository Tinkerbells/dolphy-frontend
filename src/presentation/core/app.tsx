import './app.css'

import { Toaster } from 'sonner'
import { CssBaseline } from '@mui/material'
import { withErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { queryClient } from '@/utils/query-client'

import { BrowserRouter } from './router'
import { AppProvider } from '../../di/provider'
import { compose, ErrorHandler, logError } from './react'

const enhance = compose(component =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
    onError: logError,
  }),
)

const App = enhance(() => (
  <AppProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter />
      <CssBaseline />
      <Toaster />
      <ReactQueryDevtools position="left" initialIsOpen={false} />
    </QueryClientProvider>
  </AppProvider>
))

export default App

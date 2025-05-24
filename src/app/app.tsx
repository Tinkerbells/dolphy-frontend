import './styles/app.css'

import { Toaster } from 'sonner'
import { CssBaseline } from '@mui/material'
import { withErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { ModalHandler } from './ui'
import { BrowserRouter } from './navigation/router'
import { compose, ErrorHandler, logError, queryClient } from './react'

const enhance = compose(component =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
    onError: logError,
  }),
)

export const App = enhance(() => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter />
    <CssBaseline />
    <Toaster />
    <ModalHandler />
    <ReactQueryDevtools buttonPosition="top-left" position="right" initialIsOpen={false} />
  </QueryClientProvider>
))

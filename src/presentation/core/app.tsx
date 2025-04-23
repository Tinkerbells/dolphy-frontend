import './app.css'

import { withErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { BrowserRouter } from '.'
import { mobxQueryClient } from '../../lib/mobx-query'
import { compose, ErrorHandler, logError } from '../../lib/react'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const enhance = compose(component =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
    onError: logError,
  }),
)

const App = enhance(() => (
  <QueryClientProvider client={mobxQueryClient}>
    <BrowserRouter />
    <ReactQueryDevtools position="left" initialIsOpen={false} />
  </QueryClientProvider>
))

export default App

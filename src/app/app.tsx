import './styles/app.css'

import { Toaster } from 'sonner'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { withErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { setupMobxDevTools } from '@/devtools'
import { cacheInstance, ModalHandler, theme } from '@/common'

import { BrowserRouter } from './navigation/router'
import { compose, ErrorHandler, logError } from './react'

setupMobxDevTools()

const enhance = compose(component =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
    onError: logError,
  }),
)

export const App = enhance(() => {
  const queryClient = cacheInstance.getClient()
  queryClient.mount()
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        theme={theme}
        defaultMode="light"
        noSsr
      >
        <CssBaseline />
        <BrowserRouter />
        <Toaster />
        <ModalHandler />
        <ReactQueryDevtools buttonPosition="bottom-left" position="right" initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  )
})

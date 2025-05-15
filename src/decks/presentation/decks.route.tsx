import type { RouteObject } from 'react-router'

import { createElement, lazy } from 'react'
import { CircularProgress } from '@mui/material'
import { withErrorBoundary } from 'react-error-boundary'

import { root } from '@/core/presentation/navigation/routes.ts'
import { compose, ErrorHandler, logError, withSuspense } from '@/core/presentation/react'

const DecksPage = lazy(() =>
  import('./decks-page.tsx').then(module => ({ default: module.DecksPage })),
)

const enhance = compose(
  component => withSuspense(component, { FallbackComponent: CircularProgress }),
  component =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
)

export const decksPageRoute: RouteObject = {
  path: root.decks.$path(),
  element: createElement(enhance(DecksPage)),
}

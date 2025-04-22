import type { RouteObject } from 'react-router'

import { createElement, lazy } from 'react'
import { LoadingOverlay } from '@mantine/core'
import { withErrorBoundary } from 'react-error-boundary'

import { root } from '@/lib/react-router'
import { withBottomNavigation } from '@/views/hocs'
import { compose, ErrorHandler, logError, withSuspense } from '@/lib/react'

const DeckDetailPage = lazy(() =>
  import('./deck-detail-page').then(module => ({ default: module.DeckDetailPage })),
)

const enhance = compose(
  component => withSuspense(component, { FallbackComponent: LoadingOverlay }),
  component => withBottomNavigation(component),
  component =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
)

export const deckDetailPageRoute: RouteObject = {
  path: root.decks.detail.$path(),
  element: createElement(enhance(DeckDetailPage)),
}

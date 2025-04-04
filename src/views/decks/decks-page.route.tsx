import type { RouteObject } from 'react-router'

import { createElement, lazy } from 'react'
import { withErrorBoundary } from 'react-error-boundary'

import { root } from '@/lib/react-router'
import { compose, ErrorHandler, logError } from '@/lib/react'

import { withBottomNavigation } from '../hocs'

const DecksPage = lazy(() =>
  import('./decks-page').then(module => ({ default: module.DecksPage })),
)

const enhance = compose(
  component =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
  component => withBottomNavigation(component),
)

export const decksPageRoute: RouteObject = {
  path: root.decks.$path(),
  element: createElement(enhance(DecksPage)),
}

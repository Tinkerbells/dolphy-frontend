import type { RouteObject } from 'react-router'

import { createElement, lazy } from 'react'
import { CircularProgress } from '@mui/material'
import { withErrorBoundary } from 'react-error-boundary'

import { root } from '@/app/navigation/routes'
import { compose, ErrorHandler, logError, withSuspense } from '@/app/react'

const StudyPage = lazy(() =>
  import('./study.page.tsx').then(module => ({ default: module.StudyPage })),
)

const enhance = compose(
  component => withSuspense(component, { FallbackComponent: CircularProgress }),
  component =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
)

export const studyPageRoute: RouteObject = {
  path: root.decks.detail.study.$path(),
  element: createElement(enhance(StudyPage)),
}

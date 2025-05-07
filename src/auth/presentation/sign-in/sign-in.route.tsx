import type { RouteObject } from 'react-router'

import { observer } from 'mobx-react-lite'
import { createElement, lazy } from 'react'
import { CircularProgress } from '@mui/material'
import { withErrorBoundary } from 'react-error-boundary'

import { root } from '@/core/presentation/navigation/routes.ts'
import { compose, ErrorHandler, logError, withSuspense } from '@/core/presentation/react'

const SignInPage = lazy(() =>
  import('./sign-in.page.tsx').then(module => ({ default: observer(module.SignInPage) })),
)

const enhance = compose(
  component => withSuspense(component, { FallbackComponent: CircularProgress }),
  component =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
)

export const signInPageRoute: RouteObject = {
  path: root['sign-in'].$path(),
  element: createElement(enhance(SignInPage)),
}

import type { RouteObject } from 'react-router'

import { createElement, lazy } from 'react'
import { CircularProgress } from '@mui/material'
import { withErrorBoundary } from 'react-error-boundary'

import { root } from '@/app/navigation/routes.ts'
import { compose, ErrorHandler, logError, withSuspense } from '@/app/react'

const SignUpPage = lazy(() =>
  import('./sign-up.page.tsx').then(module => ({ default: module.SignUpPage })),
)

const enhance = compose(
  component => withSuspense(component, { FallbackComponent: CircularProgress }),
  component =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
)

export const signUpPageRoute: RouteObject = {
  path: root['sign-up'].$path(),
  element: createElement(enhance(SignUpPage)),
}

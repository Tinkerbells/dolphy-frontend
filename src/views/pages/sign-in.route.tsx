import type { RouteObject } from 'react-router'

import { createElement, lazy } from 'react'
import { LoadingOverlay } from '@mantine/core'
import { withErrorBoundary } from 'react-error-boundary'

import { root } from '@/lib/react-router'
import { withBottomNavigation } from '@/views/hocs'
import { compose, ErrorHandler, logError, withSuspense } from '@/lib/react'

const SignInPage = lazy(() =>
  import('./sign-in.page.tsx').then(module => ({ default: module.SignInPage })),
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

export const signInPageRoute: RouteObject = {
  path: root['sing-in'].$path(),
  element: createElement(enhance(SignInPage)),
}

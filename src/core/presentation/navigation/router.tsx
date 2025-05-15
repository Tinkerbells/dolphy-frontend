import { createElement } from 'react'
import { CircularProgress } from '@mui/material'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router'

import { decksPageRoute } from '@/decks/presentation'
import { signInPageRoute } from '@/auth/presentation/sign-in'
import { signUpPageRoute } from '@/auth/presentation/sign-up'

import { root } from './routes'
import { compose, withSuspense } from '../react'
import { AuthorizedLayout, NotAuthorizedLayout } from '../ui'

const enhance = compose(component =>
  withSuspense(component, { FallbackComponent: CircularProgress }),
)

function MainLayout() {
  return (
    <>
      <Outlet />
    </>
  )
}

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to={root['sign-in'].$path()} replace /> },
      {
        element: createElement(enhance(NotAuthorizedLayout)),
        children: [signInPageRoute, signUpPageRoute],
      },
      {
        element: createElement(enhance(AuthorizedLayout)),
        children: [decksPageRoute],
      },
      { path: '*', element: <Navigate to={root['sign-in'].$path()} replace /> },
    ],
  },
])

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />
}

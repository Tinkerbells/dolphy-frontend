import { createElement } from 'react'
import { CircularProgress } from '@mui/material'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router'

import { AuthorizedLayout, NotAuthorizedLayout, RouterServiceAdapter } from '@/common'
import { deckDetailPageRoute, decksPageRoute, signInPageRoute, signUpPageRoute } from '@/features'

import { root } from './routes'
import { compose, withSuspense } from '../react'

const enhance = compose(component =>
  withSuspense(component, { FallbackComponent: CircularProgress }),
)

function MainLayout() {
  return (
    <>
      <RouterServiceAdapter />
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
        children: [decksPageRoute, deckDetailPageRoute],
      },
      { path: '*', element: <Navigate to={root['sign-in'].$path()} replace /> },
    ],
  },
])

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />
}

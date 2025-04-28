import { createElement } from 'react'
import { observer } from 'mobx-react-lite'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router'

import { root } from './react-router'
import { decksPageRoute } from '../decks/decks.route'
import { signInPageRoute } from '../sign-in/sign-in.route'
import { signUpPageRoute } from '../sign-up/sign-up.route'
import { AuthorizedLayout, NotAuthorizedLayout } from '../common'

const MainLayout = observer(() => {
  return (
    <>
      <Outlet />
    </>
  )
})

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to={root['sign-in'].$path()} replace /> },
      {
        element: createElement(NotAuthorizedLayout),
        children: [signInPageRoute, signUpPageRoute],
      },
      {
        element: createElement(AuthorizedLayout),
        children: [decksPageRoute],
      },
      { path: '*', element: <Navigate to={root['sign-in'].$path()} replace /> },
    ],
  },
])

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />
}

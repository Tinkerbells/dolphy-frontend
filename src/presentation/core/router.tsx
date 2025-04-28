import { observer } from 'mobx-react-lite'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router'

import { root } from './react-router'
import { decksPageRoute } from '../decks/decks.route'
import { signInPageRoute } from '../sign-in/sign-in.route'
import { signUpPageRoute } from '../sign-up/sign-up.route'

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
        children: [signInPageRoute, signUpPageRoute, decksPageRoute],
      },
      { path: '*', element: <Navigate to={root['sign-in'].$path()} replace /> },
    ],
  },
])

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />
}

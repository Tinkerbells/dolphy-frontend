import { observer } from 'mobx-react-lite'
import { Notifications } from '@mantine/notifications'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router'

import { root } from '@/lib/react-router'

import { signInPageRoute } from '../pages/sign-in.route'
import { deckDetailPageRoute, decksPageRoute } from '../decks'

const MainLayout = observer(() => {
  return (
    <>
      <Outlet />
      <Notifications position="top-center" />
    </>
  )
})

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to={root.decks.$path()} replace /> },
      {
        children: [decksPageRoute, deckDetailPageRoute, signInPageRoute],
      },
      { path: '*', element: <Navigate to={root.decks.$path()} replace /> },
    ],
  },
])

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />
}

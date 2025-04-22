import { AppShell } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { Notifications } from '@mantine/notifications'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router'

import { root } from '@/lib/react-router'

import { deckDetailPageRoute, decksPageRoute } from '../decks'

const MainLayout = observer(() => {
  return (
    <AppShell className="root-wrapper">
      <Outlet />
      <Notifications position="top-center" />
    </AppShell>
  )
})

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to={root.decks.$path()} replace /> },
      {
        children: [decksPageRoute, deckDetailPageRoute],
      },
      { path: '*', element: <Navigate to={root.decks.$path()} replace /> },
    ],
  },
])

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />
}

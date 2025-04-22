import { observer } from 'mobx-react-lite'
import CssBaseline from '@mui/material/CssBaseline'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router'

import { root } from '@/lib/react-router'

import { signInPageRoute } from '../sign-in/sign-in.route'

const MainLayout = observer(() => {
  return (
    <>
      <Outlet />
      <CssBaseline />
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
        children: [signInPageRoute],
      },
      { path: '*', element: <Navigate to={root['sign-in'].$path()} replace /> },
    ],
  },
])

export function BrowserRouter() {
  return <RouterProvider router={browserRouter} />
}

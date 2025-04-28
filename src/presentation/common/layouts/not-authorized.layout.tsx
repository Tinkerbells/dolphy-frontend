import { Outlet } from 'react-router'

import { NotAuthHeader } from '../header'

export function NotAuthorizedLayout() {
  return (
    <>
      <NotAuthHeader />
      <Outlet />
    </>
  )
}

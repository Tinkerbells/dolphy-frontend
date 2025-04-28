import { Outlet } from 'react-router'

import { AuthHeader } from '../header'

export function AuthorizedLayout() {
  return (
    <>
      <AuthHeader />
      <Outlet />
    </>
  )
}

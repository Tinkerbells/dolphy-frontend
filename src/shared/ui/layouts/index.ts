import { lazy } from 'react'

export const AuthorizedLayout = lazy(() => import('./authorized.layout.tsx').then(module => ({
  default: module.AuthorizedLayout,
})))

export const NotAuthorizedLayout = lazy(() => import('./not-authorized.layout.tsx').then(module => ({
  default: module.NotAuthorizedLayout,
})))

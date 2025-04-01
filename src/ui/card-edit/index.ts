import * as React from 'react'

export const CardEditPage = React.lazy(() => import('./card-edit-page.tsx').then(module => ({
  default: module.CardEditPage,
})))
